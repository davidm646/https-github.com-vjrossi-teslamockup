import React, { useState, useEffect } from 'react';
import { VehicleData, AppMode } from './types';
import { getVehicle, login, logout, wakeUp } from './services/teslaService';
import { hasAuthToken } from './services/actions';
import VehicleVisualization from './components/VehicleVisualization';
import StatusGrid from './components/StatusGrid';
import AiMechanic from './components/AiMechanic';
import ChargingChart from './components/ChargingChart';
import { Zap, Command, LogOut, Loader2, AlertTriangle, Power } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LOGIN);
  const [token, setToken] = useState('');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // We check both the server-side cookie and local demo state
        const hasToken = await hasAuthToken();
        const isDemo = localStorage.getItem('tesla_demo_mode') === 'true';

        if (hasToken || isDemo) {
            setLoading(true);
            const data = await getVehicle();
            setVehicleData(data);
            setMode(AppMode.DASHBOARD);
            setLoading(false);
        }
      } catch (err) {
        console.error("Session check failed", err);
        // If session fails (e.g. invalid token), just stay on login
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (isDemo: boolean) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await login(isDemo ? 'demo' : token, isDemo);
      setVehicleData(data);
      setMode(AppMode.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to vehicle.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setVehicleData(null);
    setToken('');
    setMode(AppMode.LOGIN);
  };

  const handleWakeUp = async () => {
    if (!vehicleData) return;
    setWakingUp(true);
    try {
        const success = await wakeUp(vehicleData.id);
        if (success) {
            // Re-fetch data after wake up to get latest status
            const data = await getVehicle();
            setVehicleData(data);
        } else {
            setError("Failed to wake up vehicle.");
        }
    } catch (err) {
        setError("Wake up command failed.");
    } finally {
        setWakingUp(false);
    }
  };

  if (mode === AppMode.LOGIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-neutral-800 rounded-full mb-4 shadow-lg border border-neutral-700">
               <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Tesla Command</h1>
            <p className="text-neutral-500 mt-2 text-center">Enter your Tesla Access Token to connect, or try the demo mode.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Access Token</label>
              <input 
                type="password" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJh..."
                className="w-full bg-black/50 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                 <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <button 
              onClick={() => handleLogin(false)}
              disabled={!token || loading}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading && !token.includes('demo') ? <Loader2 className="animate-spin mr-2" /> : null}
              Connect Vehicle
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-4 text-neutral-600 text-sm">OR</span>
                <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            <button 
              onClick={() => handleLogin(true)}
              disabled={loading}
              className="w-full bg-neutral-800 border border-neutral-700 text-white font-medium py-3 rounded-xl hover:bg-neutral-700 transition-all flex justify-center items-center"
            >
               {loading && token.includes('demo') ? <Loader2 className="animate-spin mr-2" /> : "Launch Demo Mode"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAsleep = vehicleData?.state !== 'online';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Zap className="text-white fill-white" size={20} />
          <span className="font-bold tracking-wide">TESLA COMMAND</span>
        </div>
        <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border ${isAsleep ? 'bg-neutral-800 border-neutral-700' : 'bg-green-900/20 border-green-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isAsleep ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
                <span className="text-xs text-neutral-300 font-mono">{isAsleep ? 'ASLEEP' : 'CONNECTED'}</span>
            </div>
            <button 
                onClick={handleLogout}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
                <LogOut size={20} />
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Asleep Banner */}
        {isAsleep && (
             <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-2xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                     <AlertTriangle className="text-yellow-500" />
                     <span className="text-yellow-100">Vehicle is currently asleep. Data may be stale.</span>
                 </div>
                 <button 
                    onClick={handleWakeUp}
                    disabled={wakingUp}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2"
                 >
                     {wakingUp ? <Loader2 className="animate-spin w-4 h-4"/> : <Power className="w-4 h-4"/>}
                     WAKE UP
                 </button>
             </div>
        )}

        {/* Top Section: Visualization & Stats */}
        {vehicleData && (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isAsleep ? 'opacity-70 pointer-events-none filter grayscale-[0.3]' : ''}`}>
                <VehicleVisualization data={vehicleData} />
                <div className="flex flex-col gap-8">
                    <StatusGrid data={vehicleData} />
                    <ChargingChart />
                </div>
            </div>
        )}

        {/* Bottom Section: AI & Controls (Controls placeholder for now) */}
        {vehicleData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Actions Grid */}
                     <div className={`bg-neutral-900 rounded-3xl p-6 border border-neutral-800 ${isAsleep ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Command size={18} /> Quick Controls
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button className="bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 border border-neutral-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">🔒</span>
                                <span className="text-sm font-medium">Lock</span>
                            </button>
                             <button className="bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 border border-neutral-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">🔓</span>
                                <span className="text-sm font-medium">Unlock</span>
                            </button>
                             <button className="bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 border border-neutral-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">❄️</span>
                                <span className="text-sm font-medium">Climate</span>
                            </button>
                             <button className="bg-neutral-800 p-4 rounded-xl hover:bg-neutral-700 border border-neutral-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2">
                                <span className="text-2xl">⚡</span>
                                <span className="text-sm font-medium">Port</span>
                            </button>
                        </div>
                     </div>
                </div>

                <div className="lg:col-span-1">
                    <AiMechanic data={vehicleData} />
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
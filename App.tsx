import React, { useState, useEffect } from 'react';
import { VehicleData, AppMode } from './types';
import { getVehicleData } from './services/teslaService';
import VehicleVisualization from './components/VehicleVisualization';
import StatusGrid from './components/StatusGrid';
import AiMechanic from './components/AiMechanic';
import ChargingChart from './components/ChargingChart';
import { Zap, Command, LogOut, Loader2, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LOGIN);
  const [token, setToken] = useState('');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (isDemo: boolean) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getVehicleData(isDemo ? 'demo' : token, isDemo);
      setVehicleData(data);
      setMode(AppMode.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to vehicle.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setVehicleData(null);
    setToken('');
    setMode(AppMode.LOGIN);
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
            
             {/* Note about CORS */}
            <div className="text-xs text-neutral-600 leading-relaxed px-1">
               <strong>Note:</strong> Connecting directly to the Tesla API from a browser usually fails due to CORS security policies unless you are using a proxy.
            </div>

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Zap className="text-white fill-white" size={20} />
          <span className="font-bold tracking-wide">TESLA COMMAND</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full border border-neutral-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-neutral-300 font-mono">LIVE API</span>
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
        
        {/* Top Section: Visualization & Stats */}
        {vehicleData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                     <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
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

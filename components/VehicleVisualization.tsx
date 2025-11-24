import React from 'react';
import { VehicleData } from '../types';

interface Props {
  data: VehicleData;
}

const VehicleVisualization: React.FC<Props> = ({ data }) => {
  // Determine car state visual
  const isLightsOn = data.vehicle_state.sentry_mode || data.state === 'online';
  
  return (
    <div className="relative w-full h-64 md:h-96 flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-700 shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Car Placeholder - Using a high quality placeholder or CSS art is tricky, using a clean image */}
      <img 
        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop" 
        alt="Tesla Model"
        className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl mix-blend-overlay opacity-50"
        style={{ filter: 'grayscale(100%) contrast(120%) brightness(80%)' }} // Silhouette look
      />
      
      {/* Overlay Overlay Image for better look */}
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/2020_Tesla_Model_3_Standard_Range_Plus_in_Deep_Blue_Metallic%2C_Front_Left_10-24-2020.jpg/1200px-2020_Tesla_Model_3_Standard_Range_Plus_in_Deep_Blue_Metallic%2C_Front_Left_10-24-2020.jpg"
        alt="Tesla Model Real"
        className="absolute z-20 w-3/4 max-w-md object-contain drop-shadow-2xl"
        style={{ 
             maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }}
      />

      {/* Status Overlay */}
      <div className="absolute bottom-6 left-6 z-30">
        <h2 className="text-3xl font-bold tracking-tight text-white">{data.display_name}</h2>
        <p className="text-neutral-400 font-mono text-sm">{data.vin}</p>
        <div className="mt-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${data.state === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-gray-500'}`}></span>
            <span className="text-xs text-neutral-300 uppercase tracking-widest">{data.state}</span>
        </div>
      </div>
      
      {/* Visual Indicators */}
      {data.vehicle_state.locked && (
        <div className="absolute top-6 right-6 z-30 bg-neutral-900/80 backdrop-blur px-3 py-1 rounded-full border border-neutral-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="text-xs text-white font-medium">LOCKED</span>
        </div>
      )}
    </div>
  );
};

export default VehicleVisualization;

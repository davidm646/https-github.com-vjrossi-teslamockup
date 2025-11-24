import React from 'react';
import { VehicleData } from '../types';
import { Battery, Thermometer, Gauge, Wind, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  data: VehicleData;
}

const StatusGrid: React.FC<Props> = ({ data }) => {
  const batteryColor = data.charge_state.battery_level > 20 ? 'text-green-400' : 'text-red-500';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Battery Card */}
      <div className="bg-neutral-800/50 backdrop-blur-sm p-4 rounded-2xl border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Battery className={`w-5 h-5 ${batteryColor}`} />
          <span className="text-neutral-400 text-sm font-medium">Battery</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{data.charge_state.battery_level}%</span>
          <span className="text-sm text-neutral-500">SoC</span>
        </div>
        <div className="mt-1 text-sm text-neutral-400">
          {data.charge_state.battery_range.toFixed(0)} mi range
        </div>
        <div className="w-full bg-neutral-700 h-1.5 mt-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000" 
            style={{ width: `${data.charge_state.battery_level}%` }}
          />
        </div>
      </div>

      {/* Climate Card */}
      <div className="bg-neutral-800/50 backdrop-blur-sm p-4 rounded-2xl border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-5 h-5 text-orange-400" />
          <span className="text-neutral-400 text-sm font-medium">Climate</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{data.climate_state.inside_temp}°C</span>
        </div>
        <div className="mt-1 text-sm text-neutral-400 flex justify-between">
            <span>Outside: {data.climate_state.outside_temp}°C</span>
            <span className={data.climate_state.is_climate_on ? "text-blue-400" : "text-neutral-600"}>
                {data.climate_state.is_climate_on ? 'ON' : 'OFF'}
            </span>
        </div>
      </div>

      {/* Tire Pressure / Health */}
      <div className="bg-neutral-800/50 backdrop-blur-sm p-4 rounded-2xl border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-blue-400" />
          <span className="text-neutral-400 text-sm font-medium">Tires (PSI)</span>
        </div>
         <div className="grid grid-cols-2 gap-2 mt-1">
             <div className="text-center bg-neutral-900 rounded p-1">
                 <span className="text-xs text-neutral-500">FL</span>
                 <div className="font-bold text-white">{data.vehicle_state.tire_pressure_front_left}</div>
             </div>
             <div className="text-center bg-neutral-900 rounded p-1">
                 <span className="text-xs text-neutral-500">FR</span>
                 <div className="font-bold text-white">{data.vehicle_state.tire_pressure_front_right}</div>
             </div>
             <div className="text-center bg-neutral-900 rounded p-1">
                 <span className="text-xs text-neutral-500">RL</span>
                 <div className="font-bold text-white">{data.vehicle_state.tire_pressure_rear_left}</div>
             </div>
             <div className="text-center bg-neutral-900 rounded p-1">
                 <span className="text-xs text-neutral-500">RR</span>
                 <div className="font-bold text-white">{data.vehicle_state.tire_pressure_rear_right}</div>
             </div>
         </div>
      </div>

      {/* Security Status */}
      <div className="bg-neutral-800/50 backdrop-blur-sm p-4 rounded-2xl border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span className="text-neutral-400 text-sm font-medium">Security</span>
        </div>
        <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300">Sentry Mode</span>
                <span className={`font-bold ${data.vehicle_state.sentry_mode ? 'text-red-500' : 'text-neutral-500'}`}>
                    {data.vehicle_state.sentry_mode ? 'ARMED' : 'OFF'}
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300">Odometer</span>
                <span className="text-white font-mono">{(data.vehicle_state.odometer / 1000).toFixed(1)}k mi</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300">Location</span>
                <span className="text-neutral-500 text-xs">San Francisco</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatusGrid;

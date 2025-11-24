import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { time: '10:00', level: 45 },
  { time: '11:00', level: 55 },
  { time: '12:00', level: 68 },
  { time: '13:00', level: 75 },
  { time: '14:00', level: 78 },
  { time: '15:00', level: 78 }, // Idle
  { time: '16:00', level: 77 }, // Driving slight drop
];

const ChargingChart: React.FC = () => {
  return (
    <div className="bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700/50 h-[300px]">
      <h3 className="text-lg font-bold text-white mb-4">Battery History</h3>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
                dataKey="time" 
                stroke="#666" 
                tick={{fontSize: 12}} 
                axisLine={false} 
                tickLine={false}
            />
            <YAxis 
                stroke="#666" 
                tick={{fontSize: 12}} 
                axisLine={false} 
                tickLine={false}
                unit="%"
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: '#22c55e' }}
            />
            <Area 
                type="monotone" 
                dataKey="level" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorLevel)" 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChargingChart;

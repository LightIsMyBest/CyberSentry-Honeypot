import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SystemMetric } from '../types';

interface SystemMetricChartProps {
  data: SystemMetric[];
  title: string;
  color: string;
  unit: string;
}

const SystemMetricChart: React.FC<SystemMetricChartProps> = ({ data, title, color, unit }) => {
  return (
    <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4 h-48 flex flex-col">
      <h3 className="text-md font-bold text-green-400">{title}</h3>
      <p className="text-2xl font-semibold text-gray-100">{data[data.length-1]?.value}{unit}</p>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
             <defs>
                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <YAxis stroke="#4b5563" tick={{ fill: '#d1d5db', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                borderColor: color,
                color: '#fff',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`${value}${unit}`, 'Value']}
            />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${title})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemMetricChart;

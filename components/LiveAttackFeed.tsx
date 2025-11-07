import React from 'react';
import { Attack, Severity } from '../types';
import { ShieldAlert, ShieldCheck, ShieldHalf, ShieldQuestion } from './Icons';

interface LiveAttackFeedProps {
  attacks: Attack[];
  onSelectAttack: (attack: Attack) => void;
  selectedAttackId?: string;
}

const severityConfig = {
  [Severity.Critical]: {
    color: 'text-red-500 border-red-500/50',
    icon: <ShieldAlert className="w-5 h-5" />,
    bgColor: 'bg-red-500/10 hover:bg-red-500/20',
    selectedBgColor: 'bg-red-500/30'
  },
  [Severity.High]: {
    color: 'text-orange-400 border-orange-400/50',
    icon: <ShieldAlert className="w-5 h-5" />,
    bgColor: 'bg-orange-400/10 hover:bg-orange-400/20',
    selectedBgColor: 'bg-orange-400/30'
  },
  [Severity.Medium]: {
    color: 'text-yellow-400 border-yellow-400/50',
    icon: <ShieldHalf className="w-5 h-5" />,
    bgColor: 'bg-yellow-400/10 hover:bg-yellow-400/20',
    selectedBgColor: 'bg-yellow-400/30'
  },
  [Severity.Low]: {
    color: 'text-blue-400 border-blue-400/50',
    icon: <ShieldCheck className="w-5 h-5" />,
    bgColor: 'bg-blue-400/10 hover:bg-blue-400/20',
    selectedBgColor: 'bg-blue-400/30'
  },
};

const LiveAttackFeed: React.FC<LiveAttackFeedProps> = ({ attacks, onSelectAttack, selectedAttackId }) => {
  return (
    <div className="overflow-y-auto h-full pr-2">
      <ul className="space-y-2">
        {attacks.map(attack => {
          const config = severityConfig[attack.severity] || { color: 'text-gray-400', icon: <ShieldQuestion className="w-5 h-5"/>, bgColor: 'bg-gray-400/10', selectedBgColor: 'bg-gray-400/30' };
          const isSelected = selectedAttackId === attack.id;
          const bgClass = isSelected ? config.selectedBgColor : config.bgColor;

          return (
            <li
              key={attack.id}
              onClick={() => onSelectAttack(attack)}
              className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 border border-transparent hover:border-green-400/50 ${bgClass}`}
            >
              <div className={`mr-3 ${config.color}`}>
                {config.icon}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold truncate text-gray-100">{attack.type}</p>
                <p className="text-xs text-gray-400">{attack.ip} - {attack.country}</p>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                 <p className={`text-xs font-bold ${config.color}`}>{attack.severity}</p>
                 <p className="text-xs text-gray-500">{new Date(attack.timestamp).toLocaleTimeString()}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LiveAttackFeed;

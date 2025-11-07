import React, { useState } from 'react';
import { ATTACK_TYPES, SEVERITY_LEVELS, COUNTRIES } from '../constants';
import { Severity } from '../types';

interface AttackSimulatorProps {
  onTriggerAttack: (details: { type: string; severity: Severity; country: string }) => void;
}

const AttackSimulator: React.FC<AttackSimulatorProps> = ({ onTriggerAttack }) => {
    const [type, setType] = useState(ATTACK_TYPES[0]);
    const [severity, setSeverity] = useState<Severity>(Severity.Medium);
    const [country, setCountry] = useState(COUNTRIES[0].name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onTriggerAttack({ type, severity, country });
    };

    return (
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4">
            <h3 className="text-md font-bold text-green-400 mb-3">Attack Simulator</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                 <div>
                    <label htmlFor="sim-type" className="block text-xs font-medium text-gray-400 mb-1">Attack Type</label>
                    <select
                        id="sim-type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {ATTACK_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="sim-severity" className="block text-xs font-medium text-gray-400 mb-1">Severity</label>
                    <select
                        id="sim-severity"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as Severity)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {SEVERITY_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="sim-country" className="block text-xs font-medium text-gray-400 mb-1">Origin Country</label>
                    <select
                        id="sim-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {COUNTRIES.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-red-600/80 text-white font-bold py-1 px-4 rounded-md hover:bg-red-500/80 transition-colors"
                >
                    Trigger Attack
                </button>
            </form>
        </div>
    );
};

export default AttackSimulator;

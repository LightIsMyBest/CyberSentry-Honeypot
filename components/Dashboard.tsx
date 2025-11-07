import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Attack, Severity, SystemMetric } from '../types';
import { ATTACK_TYPES, COUNTRIES, MAX_ATTACKS_IN_FEED } from '../constants';
import LiveAttackFeed from './LiveAttackFeed';
import AttackDetails from './AttackDetails';
import WorldMap from './WorldMap';
import SystemMetricChart from './SystemMetricChart';
import FilterControls from './FilterControls';
import AttackSimulator from './AttackSimulator';

const generateRandomIp = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const Dashboard: React.FC = () => {
  const [attacks, setAttacks] = useState<Attack[]>(() => {
    try {
      const savedAttacks = localStorage.getItem('honeypot_attacks');
      return savedAttacks ? JSON.parse(savedAttacks) : [];
    } catch (error) {
      console.error("Failed to parse attacks from localStorage", error);
      return [];
    }
  });
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  
  const [cpuData, setCpuData] = useState<SystemMetric[]>([]);
  const [memData, setMemData] = useState<SystemMetric[]>([]);
  const [netData, setNetData] = useState<SystemMetric[]>([]);

  const [filters, setFilters] = useState({
    type: 'All',
    severity: 'All',
    country: 'All',
  });

  const addNewAttack = useCallback((newAttack: Attack) => {
      setAttacks(prevAttacks => {
          const updatedAttacks = [newAttack, ...prevAttacks];
          const uniqueAttacks = Array.from(new Map(updatedAttacks.map(a => [a.id, a])).values());
          return uniqueAttacks.slice(0, MAX_ATTACKS_IN_FEED);
      });
  }, []);

  const createAttack = useCallback(() => {
    const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const severityValues = Object.values(Severity);
    const randomSeverity = severityValues[Math.floor(Math.random() * severityValues.length)];

    const newAttack: Attack = {
      id: `evt-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      ip: generateRandomIp(),
      type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
      severity: randomSeverity,
      country: randomCountry.name,
      coords: randomCountry.coords,
    };
    addNewAttack(newAttack);
  }, [addNewAttack]);

  useEffect(() => {
    const attackInterval = setInterval(createAttack, Math.random() * 3000 + 1500);
    return () => clearInterval(attackInterval);
  }, [createAttack]);
  
  useEffect(() => {
      try {
          localStorage.setItem('honeypot_attacks', JSON.stringify(attacks));
      } catch (error) {
          console.error("Failed to save attacks to localStorage", error);
      }
  }, [attacks]);

  useEffect(() => {
    const initialData = Array(20).fill(0).map((_, i) => ({ name: `${20 - i}s`, value: 0 }));
    setCpuData(initialData);
    setMemData(initialData);
    setNetData(initialData);

    const metricsInterval = setInterval(() => {
        const updateData = (data: SystemMetric[]) => {
            const newValue = Math.random() * 100;
            const newData = [...data.slice(1), { name: 'now', value: parseFloat(newValue.toFixed(1)) }];
            return newData.map((d, i) => ({ ...d, name: `${19 - i}s ago`}));
        };
        setCpuData(updateData);
        setMemData(updateData);
        setNetData(updateData);
    }, 1000);
    return () => clearInterval(metricsInterval);
  }, []);

  const handleSelectAttack = (attack: Attack) => {
    setSelectedAttack(attack);
  };

  const handleFilterChange = (filterType: 'type' | 'severity' | 'country', value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleTriggerAttack = (details: { type: string; severity: Severity; country: string }) => {
    const countryData = COUNTRIES.find(c => c.name === details.country) || COUNTRIES[0];
    const newAttack: Attack = {
      id: `evt-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      ip: generateRandomIp(),
      type: details.type,
      severity: details.severity,
      country: countryData.name,
      coords: countryData.coords,
    };
    addNewAttack(newAttack);
  };

  const filteredAttacks = useMemo(() => {
    return attacks.filter(attack => {
      const typeMatch = filters.type === 'All' || attack.type === filters.type;
      const severityMatch = filters.severity === 'All' || attack.severity === filters.severity;
      const countryMatch = filters.country === 'All' || attack.country === filters.country;
      return typeMatch && severityMatch && countryMatch;
    });
  }, [attacks, filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
         <SystemMetricChart data={cpuData} title="CPU Utilization" color="#22c55e" unit="%" />
         <SystemMetricChart data={memData} title="Memory Usage" color="#3b82f6" unit="%" />
         <SystemMetricChart data={netData} title="Network Traffic" color="#f97316" unit="MB/s" />
      </div>

      <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FilterControls filters={filters} onFilterChange={handleFilterChange} />
        <AttackSimulator onTriggerAttack={handleTriggerAttack} />
      </div>

      <div className="lg:col-span-2 xl:col-span-2 grid grid-cols-1 gap-6">
          <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4 h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-green-400 mb-2">Threat Origins</h2>
            <div className="flex-grow">
              <WorldMap attacks={filteredAttacks} onSelectAttack={handleSelectAttack} selectedAttackId={selectedAttack?.id} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4 h-[400px] flex flex-col">
             <h2 className="text-lg font-bold text-green-400 mb-2">Live Attack Feed</h2>
             <LiveAttackFeed attacks={filteredAttacks} onSelectAttack={handleSelectAttack} selectedAttackId={selectedAttack?.id} />
          </div>
      </div>

      <div className="lg:col-span-1 xl:col-span-2 bg-gray-900/50 border border-green-500/20 rounded-lg p-4 h-[932px]">
        <h2 className="text-lg font-bold text-green-400 mb-2">Threat Analysis</h2>
        <AttackDetails attack={selectedAttack} />
      </div>
    </div>
  );
};

export default Dashboard;

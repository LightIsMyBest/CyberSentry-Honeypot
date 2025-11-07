import React from 'react';
import { ATTACK_TYPES } from '../constants';
import { Severity } from '../types';

const countryOptions = [ 'All', 'USA', 'China', 'Russia', 'Brazil', 'Germany', 'India', 'Nigeria', 'North Korea', 'UK', 'Iran'];

interface FilterControlsProps {
  filters: {
    type: string;
    severity: string;
    country: string;
  };
  onFilterChange: (filterType: 'type' | 'severity' | 'country', value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
    const attackTypeOptions = ['All', ...ATTACK_TYPES];
    const severityOptions = ['All', ...Object.values(Severity)];
    
    return (
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
            <h3 className="text-md font-bold text-green-400 flex-shrink-0">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div>
                    <label htmlFor="type-filter" className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                    <select
                        id="type-filter"
                        value={filters.type}
                        onChange={(e) => onFilterChange('type', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {attackTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="severity-filter" className="block text-xs font-medium text-gray-400 mb-1">Severity</label>
                    <select
                        id="severity-filter"
                        value={filters.severity}
                        onChange={(e) => onFilterChange('severity', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {severityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="country-filter" className="block text-xs font-medium text-gray-400 mb-1">Country</label>
                    <select
                        id="country-filter"
                        value={filters.country}
                        onChange={(e) => onFilterChange('country', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 focus:ring-green-500 focus:border-green-500"
                    >
                        {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;

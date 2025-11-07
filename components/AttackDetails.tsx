import React, { useState, useEffect } from 'react';
import { Attack } from '../types';
import { getAttackAnalysis, getAttackSummary } from '../services/geminiService';

interface AttackDetailsProps {
  attack: Attack | null;
}

const KNOWN_HEADINGS = [
  'Threat Description:',
  'Potential Impact:',
  'Indicators of Compromise (IoCs):',
  'Recommended Mitigation Steps:',
  'Simulated Log Entry:',
];

const AttackDetails: React.FC<AttackDetailsProps> = ({ attack }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (attack) {
      setLoading(true);
      setAnalysis('');
      setSummary('');
      getAttackAnalysis(attack)
        .then(setAnalysis)
        .catch(err => {
            console.error(err);
            setAnalysis("Failed to load analysis.");
        })
        .finally(() => setLoading(false));
    }
  }, [attack]);

  const handleSummarize = async () => {
    if (!analysis) return;
    setSummaryLoading(true);
    setSummary('');
    try {
      const result = await getAttackSummary(analysis);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setSummary("Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };


  if (!attack) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select an attack from the feed to view details.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-4">
      <div>
        <h3 className="text-md font-bold text-green-300">{attack.type}</h3>
        <p className="text-sm text-gray-400">
          {attack.ip} ({attack.country})
        </p>
        <p className="text-xs text-gray-500">
          {new Date(attack.timestamp).toLocaleString()}
        </p>
      </div>
      <div className="border-t border-green-500/20 pt-4">
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-semibold text-green-300">AI-Powered Analysis</h4>
            {analysis && !loading && (
                <button 
                    onClick={handleSummarize}
                    disabled={summaryLoading}
                    className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-md hover:bg-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {summaryLoading ? 'Summarizing...' : 'Quick Summary'}
                </button>
            )}
        </div>

        {summary && (
            <div className="mb-4 p-3 bg-gray-800/50 border border-blue-400/30 rounded-lg">
                <p className="text-sm text-blue-200">{summary}</p>
            </div>
        )}

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3 mt-6"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
          </div>
        )}
        {analysis && (
          <article className="text-gray-300">
            {analysis.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                const trimmedLine = line.trim();
                if (KNOWN_HEADINGS.includes(trimmedLine)) {
                    return <h4 key={index} className="font-bold text-green-300 mt-4 mb-2">{trimmedLine}</h4>
                }
                // Heuristic to detect the log entry and style it as code
                if (line.includes('ip=') || line.includes('status=') || /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]/.test(line)) {
                    return <pre key={index} className="bg-black/50 p-2 rounded text-xs text-cyan-300 whitespace-pre-wrap break-all">{line}</pre>
                }
                return <p key={index} className="text-sm text-gray-300 mb-2">{line}</p>
            })}
          </article>
        )}
      </div>
    </div>
  );
};

export default AttackDetails;
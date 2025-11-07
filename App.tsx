import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="bg-black text-gray-200 min-h-screen font-mono">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;

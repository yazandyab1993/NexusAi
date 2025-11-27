import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { User, GeneratedAsset, Transaction } from './types';
import { api } from './services/mockApi';
import { INITIAL_MODELS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // App State
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      setAssets(api.getUserAssets(user.id));
      setTransactions(api.getUserTransactions(user.id));
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (!user) return <Login onLogin={setUser} />;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} assets={assets} transactions={transactions} />;
      case 'generator':
        return (
          <Generator 
            user={user} 
            models={INITIAL_MODELS} 
            onAssetGenerated={(newAsset) => setAssets([newAsset, ...assets])}
            onUpdateUser={setUser}
          />
        );
      case 'admin':
        return <Admin currentUser={user} />;
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">Under Construction</h2>
            <p className="text-slate-400">The {currentView} page is coming soon.</p>
          </div>
        );
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout 
      currentUser={user} 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;

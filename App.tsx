import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { User, GeneratedAsset, Transaction } from './types';
import { api } from './services/api'; // Changed from mockApi to real API

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // App State
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      // Load user assets and transactions
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user) {
        const userAssets = await api.getGeneratedAssets();
        setAssets(userAssets || []);
        
        const userTransactions = await api.getUserTransactions(user.id);
        setTransactions(userTransactions || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    api.removeToken(); // Clear token on logout
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

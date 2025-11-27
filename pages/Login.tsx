import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { User } from '../types';
import { Video, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('user@client.com'); // Pre-fill for demo
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // For demo purposes, we accept specific emails to simulate role switching
      // In production, this would be a real auth call
      let loginEmail = email;
      if (email === 'admin') loginEmail = 'admin@nexus.ai';
      if (email === 'user') loginEmail = 'ahmed@client.com';

      const user = await api.login(loginEmail);
      onLogin(user);
    } catch (err) {
      setError('Invalid credentials. Try "admin@nexus.ai" or "ahmed@client.com"');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
            <Video className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">NexusAI</h1>
          <p className="text-slate-400 mt-2">Sign in to your creative studio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value="password"
              readOnly
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800">
           <p className="text-xs text-slate-500 text-center mb-2">Demo Credentials:</p>
           <div className="flex justify-center space-x-4 text-xs">
              <button onClick={() => setEmail('admin@nexus.ai')} className="text-blue-400 hover:underline">Admin (admin@nexus.ai)</button>
              <button onClick={() => setEmail('ahmed@client.com')} className="text-blue-400 hover:underline">User (ahmed@client.com)</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

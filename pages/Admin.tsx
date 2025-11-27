import React, { useEffect, useState } from 'react';
import { User, Transaction, UserRole } from '../types';
import { api } from '../services/mockApi';
import { Users, DollarSign, Search, ShieldAlert } from 'lucide-react';

interface AdminProps {
  currentUser: User;
}

const Admin: React.FC<AdminProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await api.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount) return;
    
    try {
      await api.addCredits(currentUser.id, selectedUser.id, parseInt(creditAmount));
      alert(`Successfully added ${creditAmount} credits to ${selectedUser.name}`);
      setCreditAmount('');
      setSelectedUser(null);
      loadUsers(); // Refresh list
    } catch (e) {
      alert('Failed to add credits');
    }
  };

  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <ShieldAlert size={64} className="mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">System Administration</h2>
        <p className="text-slate-400">Manage users, credits, and system health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white flex items-center">
              <Users className="mr-2" size={20} /> User Database
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900/50 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                      <img src={user.avatarUrl} className="w-8 h-8 rounded-full" />
                      <span>{user.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.role === UserRole.ADMIN ? 'bg-purple-900 text-purple-200' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-mono">{user.credits}</td>
                    <td className="px-6 py-4">{new Date(user.joinedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} /> Credit Management
            </h3>
            
            {selectedUser ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                  <p className="text-xs text-slate-500 uppercase">Selected User</p>
                  <p className="font-bold text-white text-lg">{selectedUser.name}</p>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                  <div className="mt-2 text-sm text-emerald-400">Current Balance: {selectedUser.credits}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount to Add</label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddCredits}
                    disabled={!creditAmount}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Credits
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <Users size={40} className="mx-auto mb-2 opacity-50" />
                <p>Select a user from the list<br/>to manage their credits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

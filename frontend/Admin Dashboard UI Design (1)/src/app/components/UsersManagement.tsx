import { useState, useEffect } from 'react';
import { Users, Search, UserCheck, Store, Eye, Ban, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'seller';
  status: 'active' | 'inactive';
  joined: string;
  orders?: number;
  revenue?: number;
}

export function UsersManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ customers: 0, sellers: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'customer' | 'seller'>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data.users);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? false : true;
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await adminApi.toggleUserStatus(id, newStatus);
        loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const combinedSearch = searchQuery.trim().toLowerCase();
    const matchesFilter = filter === 'all' || user.type === filter;
    const matchesSearch = user.name.toLowerCase().includes(combinedSearch) ||
                         user.email.toLowerCase().includes(combinedSearch);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load users data</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-[var(--primary)] font-bold underline">Try Again</button>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="font-['Manrope'] text-gray-600">Manage customers and seller partners</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setFilter('customer')}
          className={`rounded-2xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'customer' ? 'bg-blue-100 border-blue-300' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-blue-700">Total Customers</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-blue-900">{stats.customers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setFilter('seller')}
          className={`rounded-2xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'seller' ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' : 'bg-[var(--primary)]/5 border-[var(--primary)]/20'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-[var(--green-dark)]">Seller Partners</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-[var(--green-dark)]">{stats.sellers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setFilter('all')}
          className={`rounded-2xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'all' ? 'bg-gray-200 border-gray-400' : 'bg-gray-50 border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-gray-700">All Active</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'customer', 'seller'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-3 rounded-2xl font-['Manrope'] font-medium transition-all ${
                  filter === type
                    ? 'bg-[var(--green-dark)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">User</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Type</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Joined</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Activity</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.type === 'customer' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {user.type === 'customer' ? (
                          <UserCheck className={`w-5 h-5 text-blue-600`} />
                        ) : (
                          <Store className={`w-5 h-5 text-purple-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-['Manrope'] font-semibold text-gray-900">{user.name}</p>
                        <p className="font-['Manrope'] text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      user.type === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-600">
                      {new Date(user.joined).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {user.type === 'customer' ? (
                      <span className="font-['Manrope'] text-sm text-gray-700">{user.orders} orders</span>
                    ) : (
                      <span className="font-['Manrope'] text-sm text-gray-700">Rs {user.revenue?.toLocaleString()} revenue</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      user.status === 'active' ? 'bg-[var(--primary)]/10 text-[var(--green-dark)]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                        title={user.status === 'active' ? 'Disable Account' : 'Enable Account'}
                      >
                        <Ban className={`w-4 h-4 ${user.status === 'active' ? 'text-red-600' : 'text-[var(--primary)]'}`} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

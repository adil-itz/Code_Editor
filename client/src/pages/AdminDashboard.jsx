import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Server, 
  Database, 
  RefreshCw, 
  Search, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  Activity,
  AlertCircle,
  Terminal,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error('Failed to load administrative data.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsersList(usersData.users || []);
    } catch (err) {
      setError(err.message || 'Error connecting to admin API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update role.');
      }

      setActionSuccess(`Role for ${targetUser.email} updated to ${newRole.toUpperCase()}.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Role update failed.');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Are you sure you want to permanently delete user ${targetUser.email}?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user.');
      }

      setActionSuccess(`User ${targetUser.email} deleted successfully.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (roleFilter === 'ADMIN') return matchesSearch && u.role === 'admin';
    if (roleFilter === 'USER') return matchesSearch && u.role !== 'admin';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Security Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-status-error/15 via-surface-elevated to-surface border border-status-error/30 p-6 sm:p-8 shadow-2xl"
        >
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-status-error" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-status-error/20 border border-status-error/40 text-status-error text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SYSTEM ADMIN CONTROL CENTER</span>
                </span>
                <span className="text-xs font-mono text-text-muted">Master Credentials Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Administrator: <span className="text-status-error">{user?.name || 'Admin'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-mono">
                Logged in as: <span className="text-text-primary font-bold">{user?.email || 'admin@gmail.com'}</span> • Role: <span className="text-status-error font-bold">ADMINISTRATOR</span>
              </p>
            </div>

            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary text-xs font-mono transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-brand-primary ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Control Data</span>
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        {actionSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-status-success/15 border border-status-success/40 text-status-success text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-status-error/15 border border-status-error/40 text-status-error text-xs font-mono flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* System Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">
              {stats ? stats.totalUsers : '...'}
            </div>
            <div className="text-[11px] font-mono text-text-muted">Registered accounts</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Admins</span>
              <div className="p-2 rounded-lg bg-status-error/10 text-status-error">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-status-error">
              {stats ? stats.totalAdmins : '...'}
            </div>
            <div className="text-[11px] font-mono text-text-muted">System Administrators</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Database Engine</span>
              <div className="p-2 rounded-lg bg-status-info/10 text-status-info">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm font-bold font-mono text-text-primary truncate">
              {stats ? stats.databaseType : 'Connecting...'}
            </div>
            <div className="text-[11px] font-mono text-status-success">Online & Healthy</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Server Health</span>
              <div className="p-2 rounded-lg bg-status-success/10 text-status-success">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm font-bold font-mono text-status-success">
              {stats ? `${stats.memoryUsageMB} MB Heap` : '...'}
            </div>
            <div className="text-[11px] font-mono text-text-muted">API Status: {stats?.serverStatus || 'Operational'}</div>
          </motion.div>
        </div>

        {/* User Management Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border-main">
            <div>
              <h2 className="text-lg font-bold font-mono text-text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-primary" />
                <span>User Account Management</span>
              </h2>
              <p className="text-xs text-text-muted font-mono">View users, assign admin privileges, or manage user accounts.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Role filter buttons */}
              <div className="flex items-center bg-surface-elevated p-1 rounded-lg border border-border-main text-xs font-mono">
                {['ALL', 'USER', 'ADMIN'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRoleFilter(filter)}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      roleFilter === filter 
                        ? 'bg-brand-primary text-bg-deep font-bold' 
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/60 font-mono w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-xl border border-border-main bg-surface shadow-xl">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-bg-deep border-b border-border-main text-text-muted">
                  <th className="py-3 px-4 font-semibold">User Details</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Registered At</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-muted">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin';
                    const isSelf = u.email === user?.email;

                    return (
                      <tr key={u.id} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isAdmin 
                                ? 'bg-status-error/20 text-status-error border border-status-error/30' 
                                : 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                            }`}>
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-text-primary flex items-center gap-1.5">
                                <span>{u.name || 'User'}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/30">You</span>
                                )}
                              </div>
                              <div className="text-[10px] text-text-muted">ID: {u.id?.slice(0, 12)}...</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-text-secondary">{u.email}</td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isAdmin 
                              ? 'bg-status-error/10 text-status-error border-status-error/30' 
                              : 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
                          }`}>
                            {isAdmin ? 'ADMIN' : 'USER'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-text-muted text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRole(u)}
                              disabled={isSelf}
                              title={isAdmin ? "Demote to User" : "Promote to Admin"}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                                isSelf
                                  ? 'opacity-40 cursor-not-allowed bg-surface border-border-main text-text-muted'
                                  : isAdmin
                                  ? 'bg-status-warning/10 text-status-warning border-status-warning/30 hover:bg-status-warning/20'
                                  : 'bg-status-success/10 text-status-success border-status-success/30 hover:bg-status-success/20'
                              }`}
                            >
                              {isAdmin ? 'Demote' : 'Make Admin'}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf}
                              title="Delete User"
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isSelf
                                  ? 'opacity-40 cursor-not-allowed bg-surface border-border-main text-text-muted'
                                  : 'bg-status-error/10 text-status-error border-status-error/30 hover:bg-status-error/20'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Settings as SettingsIcon, Shield, CreditCard, Percent, Bell, Globe, Lock, Key, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

export function Settings() {
  const [taxRate, setTaxRate] = useState('8.5');
  const [taxId, setTaxId] = useState('US-TAX-123456');
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings({ taxRate, taxId });
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="font-['Manrope'] text-gray-600">Configure platform settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Tax Rules</h2>
              <p className="font-['Manrope'] text-sm text-gray-600">Configure tax calculations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-['Manrope'] text-sm font-semibold text-gray-700 mb-2 block">Default Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-['Manrope'] text-gray-700 focus:bg-white focus:border-[var(--primary)]/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="font-['Manrope'] text-sm font-semibold text-gray-700 mb-2 block">Tax ID</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-['Manrope'] text-gray-700 focus:bg-white focus:border-[var(--primary)]/20 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full px-6 py-3 bg-[var(--green-dark)] text-white rounded-xl font-['Manrope'] font-semibold hover:bg-[var(--green-primary)] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Tax Settings'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Payment Gateways</h2>
              <p className="font-['Manrope'] text-sm text-gray-600">Manage payment methods</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Stripe', enabled: true },
              { name: 'PayPal', enabled: true },
              { name: 'Square', enabled: false },
              { name: 'Digital Wallet', enabled: true },
            ].map(gateway => (
              <div key={gateway.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-['Manrope'] font-semibold text-gray-900">{gateway.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={gateway.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--green-dark)]"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Notifications</h2>
              <p className="font-['Manrope'] text-sm text-gray-600">Alert preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'New Orders', enabled: true },
              { name: 'Low Inventory', enabled: true },
              { name: 'Refund Requests', enabled: true },
              { name: 'New User Registrations', enabled: false },
              { name: 'Daily Reports', enabled: true },
            ].map(notification => (
              <div key={notification.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-['Manrope'] font-medium text-gray-900">{notification.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--green-dark)]"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Security</h2>
              <p className="font-['Manrope'] text-sm text-gray-600">Platform security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-['Manrope'] font-semibold text-gray-900 mb-1">Administrative Password</p>
              <p className="font-['Manrope'] text-sm text-gray-600 mb-3">Update your login credentials</p>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 bg-[var(--green-dark)] text-white rounded-xl font-['Manrope'] font-medium hover:bg-[var(--green-primary)] transition-colors"
              >
                Change Password
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-['Manrope'] font-semibold text-gray-900 mb-1">Session Timeout</p>
              <select className="w-full mt-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-['Manrope'] text-gray-700 focus:border-[var(--primary)]/20 focus:outline-none transition-all">
                <option>15 minutes</option>
                <option selected>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Platform Information</h2>
            <p className="font-['Manrope'] text-sm text-gray-600">System details and version</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-['Manrope'] text-xs text-gray-500 mb-1">Version</p>
            <p className="font-['Manrope'] font-semibold text-gray-900">v2.4.1</p>
          </div>
          <div>
            <p className="font-['Manrope'] text-xs text-gray-500 mb-1">Environment</p>
            <p className="font-['Manrope'] font-semibold text-gray-900">Production</p>
          </div>
          <div>
            <p className="font-['Manrope'] text-xs text-gray-500 mb-1">Uptime</p>
            <p className="font-['Manrope'] font-semibold text-gray-900">99.98%</p>
          </div>
          <div>
            <p className="font-['Manrope'] text-xs text-gray-500 mb-1">Last Updated</p>
            <p className="font-['Manrope'] font-semibold text-gray-900">Apr 10, 2026</p>
          </div>
        </div>
      </motion.div>

      {/* Password Change Modal - Reused from Profile */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPasswordModalOpen(false)}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--primary)]/5 rounded-2xl flex items-center justify-center text-[var(--primary)]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Security Update</h2>
                    <p className="font-['Manrope'] text-xs text-gray-500 font-bold uppercase tracking-widest">Change Admin Password</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="font-['Manrope'] text-sm font-bold text-gray-700 ml-1">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[var(--primary)]/20 focus:outline-none transition-all font-['Manrope']"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-['Manrope'] text-sm font-bold text-gray-700 ml-1">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[var(--primary)]/20 focus:outline-none transition-all font-['Manrope']"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-['Manrope'] text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all font-['Manrope']"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={async () => {
                    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                      alert('New passwords do not match');
                      return;
                    }
                    try {
                      setPasswordLoading(true);
                      await adminApi.changePassword({
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword
                      });
                      alert('Password updated successfully!');
                      setIsPasswordModalOpen(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    } catch (err: any) {
                      alert(err.message);
                    } finally {
                      setPasswordLoading(false);
                    }
                  }}
                  disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
                  className="w-full py-4 bg-[var(--green-dark)] text-white rounded-[1.5rem] font-bold shadow-xl shadow-[var(--green-dark)]/20 hover:bg-[var(--green-primary)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  Update Security Credentials
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

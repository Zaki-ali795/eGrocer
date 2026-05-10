import { useState } from 'react';
import { Settings as SettingsIcon, Shield, CreditCard, Percent, Bell, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

export function Settings() {
  const [taxRate, setTaxRate] = useState('8.5');
  const [taxId, setTaxId] = useState('US-TAX-123456');
  const [saving, setSaving] = useState(false);

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
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-['Manrope'] text-gray-700 focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="font-['Manrope'] text-sm font-semibold text-gray-700 mb-2 block">Tax ID</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-['Manrope'] text-gray-700 focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full px-6 py-3 bg-[#064e3b] text-white rounded-xl font-['Manrope'] font-semibold hover:bg-[#234d3e] transition-colors disabled:opacity-50"
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
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-emerald-600" />
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#064e3b]"></div>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#064e3b]"></div>
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
              <p className="font-['Manrope'] font-semibold text-gray-900 mb-1">Two-Factor Authentication</p>
              <p className="font-['Manrope'] text-sm text-gray-600 mb-3">Add extra layer of security</p>
              <button className="px-4 py-2 bg-[#064e3b] text-white rounded-xl font-['Manrope'] font-medium hover:bg-[#234d3e] transition-colors">
                Enable 2FA
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-['Manrope'] font-semibold text-gray-900 mb-1">Session Timeout</p>
              <select className="w-full mt-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-['Manrope'] text-gray-700 focus:border-[#064e3b]/20 focus:outline-none transition-all">
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
    </div>
  );
}

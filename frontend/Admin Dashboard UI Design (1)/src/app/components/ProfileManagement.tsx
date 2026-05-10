import { useState } from 'react';
import { User, Mail, Shield, Camera, Loader2, Save, Key, Eye, EyeOff, X, Lock } from 'lucide-react';
import { adminApi } from '../services/api';
import { motion } from 'motion/react';

export function ProfileManagement() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Rehan',
    lastName: 'Ahmed',
    email: 'rehan.admin@egrocer.com',
    role: 'Platform Administrator',
    bio: 'Experienced system administrator focusing on e-commerce optimization and security.',
    joined: 'January 2024'
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await adminApi.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email
      });
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="font-['Manrope'] text-gray-600">View and manage your administrative profile</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#064e3b] to-[#10b981] opacity-10"></div>
            
            <div className="relative mt-8 mb-6">
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                <User className="w-16 h-16 text-[#064e3b]" />
              </div>
              <button className="absolute bottom-0 right-1/2 translate-x-16 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
            <p className="font-['Manrope'] text-emerald-600 font-bold text-sm uppercase tracking-wider mt-1">{profileData.role}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Joined</p>
                <p className="text-sm font-bold text-gray-800">{profileData.joined}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Status</p>
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-sm font-bold text-emerald-700">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Access Level
            </h3>
            <div className="space-y-3">
              {['Full System Access', 'Financial Controls', 'User Management', 'Database Modification'].map(perm => (
                <div key={perm} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  {perm}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Edit Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm text-gray-700 ml-1">First Name</label>
                <input 
                  type="text" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm text-gray-700 ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-bold text-sm text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-bold text-sm text-gray-700 ml-1">Professional Bio</label>
                <textarea 
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none transition-all resize-none" 
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Profile Changes
              </motion.button>
            </div>
          </div>

          {!passwordChanged && (
            <div className="mt-8 bg-amber-50 rounded-3xl p-6 border border-amber-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900">Security Recommendation</h3>
                  <p className="text-sm text-amber-800/80 mt-1">
                    You last changed your administrative password 4 months ago. We recommend updating it every 90 days to maintain optimal platform security.
                  </p>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="mt-3 text-sm font-bold text-amber-900 underline hover:text-amber-700 transition-colors"
                  >
                    Change Password Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Password Change Modal */}
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
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
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
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all font-['Manrope']"
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
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:outline-none transition-all font-['Manrope']"
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
                      setPasswordChanged(true);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    } catch (err: any) {
                      alert(err.message);
                    } finally {
                      setPasswordLoading(false);
                    }
                  }}
                  disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
                  className="w-full py-4 bg-[#064e3b] text-white rounded-[1.5rem] font-bold shadow-xl shadow-emerald-900/20 hover:bg-[#053d2e] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, Store, FileText, Save, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: number;
  initialData: any;
  onUpdate: () => void;
}

export function ProfileModal({ isOpen, onClose, sellerId, initialData, onUpdate }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeName: '',
    storeDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.first_name || '',
        lastName: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        storeName: initialData.store_name || '',
        storeDescription: initialData.store_description || '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await sellerApi.updateProfile(sellerId, formData);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="relative h-28 shrink-0 bg-gradient-to-r from-[var(--green-dark)] to-[var(--green-primary)] flex items-center px-8">
              <div className="flex items-center gap-4 text-white">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Edit Profile</h2>
                  <p className="text-white/70 text-xs">Update your store and personal info</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <form id="profile-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  {/* Personal Info Section */}
                  <div className="col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <User className="w-3 h-3" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Store Info Section */}
                  <div className="col-span-2 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <Store className="w-3 h-3" /> Store Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Store Name</label>
                        <input
                          type="text"
                          value={formData.storeName}
                          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm font-bold text-[var(--green-dark)]"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" /> Store Description
                        </label>
                        <textarea
                          value={formData.storeDescription}
                          onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--green-primary)] focus:border-transparent outline-none transition-all text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white text-sm font-bold rounded-xl shadow-lg shadow-[var(--green-primary)]/30 flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

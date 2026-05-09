import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Phone, MapPin, Save, Loader2, Map, Navigation, Hash } from 'lucide-react';
import { userApi, UserProfile } from '../../services/api';
import { toast } from 'sonner';

export function ManageProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        // Replace nulls with empty strings for controlled inputs
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postalCode || ''
        });
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.firstName || !profile.lastName) {
      toast.error('First name and Last name are required');
      return;
    }

    setIsSaving(true);
    try {
      await userApi.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[var(--green-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-[var(--green-primary)]/5 overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="px-8 py-10 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border-4 border-white/30 shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Manage Profile</h2>
              <p className="text-white/80 mt-2">Update your personal details and delivery address</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--green-primary)]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Address Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--green-primary)]" />
                Default Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Apartment 4B"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">City</label>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">State / Province</label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                      placeholder="Punjab"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">Postal Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="postalCode"
                      value={profile.postalCode}
                      onChange={handleChange}
                      placeholder="54000"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--green-primary)]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="w-full py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl shadow-lg shadow-[var(--green-primary)]/30 hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

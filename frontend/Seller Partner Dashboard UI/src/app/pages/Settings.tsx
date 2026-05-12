import { useState, useEffect } from 'react';
import { User, Store, Bell, CreditCard, Save, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { sellerId } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    storeName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    status: '',
    description: ''
  });

  useEffect(() => {
    async function loadData() {
      if (!sellerId) return;
      try {
        setLoading(true);

        const [profile, notifSettings] = await Promise.all([
          sellerApi.getProfile(sellerId),
          sellerApi.getNotificationSettings(Number(sellerId))
        ]);

        setProfileData({
          storeName: profile.store_name,
          contactName: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          phone: profile.phone || 'Not provided',
          address: 'Main Warehouse',
          rating: profile.store_rating,
          status: profile.verification_status,
          description: profile.store_description || ''
        });

        setNotifications(notifSettings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sellerId]);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newRequests: true,
    promotions: false,
    weeklyReport: true
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const tabs = [
    { id: 'profile', label: 'Store Profile', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Details', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-emerald-500 hover:text-white'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border border-border shadow-sm">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#1F5F2E] flex items-center justify-center text-white text-2xl font-semibold">
                    JD
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{profileData.storeName}</h3>
                    <p className="text-muted-foreground">Premium Seller</p>
                    <button className="text-sm text-primary font-medium hover:text-primary/80 mt-1">
                      Change Photo
                    </button>
                  </div>
                </div>

                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Store Name</label>
                    <input
                      type="text"
                      value={profileData.storeName}
                      onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Contact Name</label>
                      <input
                        type="text"
                        value={profileData.contactName}
                        onChange={(e) => setProfileData({ ...profileData, contactName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Store Address</label>
                    <textarea
                      rows={3}
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!sellerId) return;
                        try {
                          const nameParts = profileData.contactName.trim().split(/\s+/);
                          const firstName = nameParts[0] || '';
                          const lastName = nameParts.slice(1).join(' ') || '';

                          await sellerApi.updateProfile(sellerId, {
                            storeName: profileData.storeName,
                            storeDescription: profileData.description,
                            phone: profileData.phone,
                            firstName,
                            lastName,
                            email: profileData.email
                          });
                          alert("Profile updated successfully!");
                        } catch (err: any) {
                          alert("Failed to update profile: " + err.message);
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose what notifications you want to receive
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'new_orders', label: 'New Orders', desc: 'Get notified when you receive new orders' },
                    { key: 'low_stock', label: 'Low Stock Alerts', desc: 'Alert when products are running low' },
                    { key: 'new_customer_requests', label: 'New Customer Requests', desc: 'Notification for new bidding requests' },
                    { key: 'promotion_updates', label: 'Promotion Updates', desc: 'Updates about your active promotions' },
                    { key: 'weekly_sales_report', label: 'Weekly Sales Report', desc: 'Receive weekly performance summary' }
                  ].map((opt) => (
                    <div key={opt.key} className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{opt.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!(notifications as any)[opt.key]}
                          onChange={(e) => {
                            const newSettings = { ...notifications, [opt.key]: e.target.checked };
                            setNotifications(newSettings);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!sellerId) return;
                      try {
                        await sellerApi.updateNotificationSettings(Number(sellerId), notifications);
                        alert("Notification preferences saved!");
                      } catch (err: any) {
                        alert("Failed to save preferences: " + err.message);
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your payment methods and bank account details
                </p>

                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
                    <input
                      type="text"
                      defaultValue="First National Bank"
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Account Number</label>
                      <input
                        type="text"
                        defaultValue="****4532"
                        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Routing Number</label>
                      <input
                        type="text"
                        defaultValue="****7821"
                        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
                      <select className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Checking</option>
                        <option>Savings</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">Payment Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      Payouts are processed automatically every Monday. Funds typically arrive within 2-3 business days.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Update Payment Info
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
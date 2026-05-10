import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../../assets/logo.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuGroups = [
  {
    title: "Overview",
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: "Management",
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'categories', label: 'Categories', icon: FolderTree },
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
    ]
  },
  {
    title: "Operations",
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'requests', label: 'Requests', icon: MessageSquare },
    ]
  },
  {
    title: "Marketing",
    items: [
      { id: 'promotions', label: 'Promotions', icon: Tag },
      { id: 'flash-deals', label: 'Flash Deals', icon: Zap },
    ]
  },
  {
    title: "Analytics & Config",
    items: [
      { id: 'users', label: 'Users', icon: Users },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-64 h-screen bg-gradient-to-b from-[#10b981] via-[#059669] to-[#064e3b] sticky top-0 flex flex-col shadow-2xl z-50 border-r border-white/5"
    >
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
            <img src={logo} alt="eGrocer Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-['Crimson_Pro'] text-2xl text-white tracking-tight font-bold">eGrocer</h1>
            <p className="font-['Manrope'] text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Admin Portal</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto no-scrollbar pb-6">
        <div className="space-y-6">
          {menuGroups.map((group, groupIndex) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + (groupIndex * 0.1) + (index * 0.05) }}
                    >
                      <button
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-['Manrope'] group relative ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 shadow-sm'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                        <span className="font-semibold text-sm">{item.label}</span>
                        {isActive && (
                          <>
                            <motion.div
                              layoutId="activeGlow"
                              className="absolute inset-0 bg-emerald-500/5 rounded-xl -z-10"
                            />
                            <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                          </>
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/10 group cursor-default">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Manrope'] text-[10px] text-white/40 font-bold uppercase tracking-wider">Server Node 01</p>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></div>
          </div>
          <p className="font-['Manrope'] text-xs text-white/80 font-medium group-hover:text-white transition-colors">Operational</p>
        </div>
      </div>
    </motion.aside>
  );
}

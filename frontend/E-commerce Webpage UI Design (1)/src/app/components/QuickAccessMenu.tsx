import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageSquare, Package, Zap, History } from 'lucide-react';
import { useNavigate } from 'react-router';

interface QuickAccessMenuProps {
}

export function QuickAccessMenu({}: QuickAccessMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'requests',
      label: 'Submit Requests',
      icon: MessageSquare,
      description: 'Request products & get best prices',
      color: 'from-blue-500 to-blue-600',
      path: '/requests',
    },
    {
      id: 'tracking',
      label: 'Track Order',
      icon: Package,
      description: 'Real-time delivery updates',
      color: 'from-[var(--green-primary)] to-[var(--green-secondary)]',
      path: '/tracking',
    },
    {
      id: 'flash-deals',
      label: 'Flash Deals',
      icon: Zap,
      description: 'Limited time offers',
      color: 'from-[var(--terracotta)] to-orange-500',
      path: '/flash-deals',
    },
    {
      id: 'previous-orders',
      label: 'Previous Orders',
      icon: History,
      description: 'Reorder your favorites',
      color: 'from-purple-500 to-purple-600',
      path: '/previous-orders',
    },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-xl shadow-lg shadow-[var(--green-primary)]/30 hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-3 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleItemClick(item.path)}
                    whileHover={{ x: 4 }}
                    className="w-full p-4 rounded-xl hover:bg-gray-50 transition-colors flex items-start gap-4 text-left group"
                  >
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

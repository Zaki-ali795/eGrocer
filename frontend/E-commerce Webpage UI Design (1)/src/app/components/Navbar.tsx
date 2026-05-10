import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuickAccessMenu } from './QuickAccessMenu';
import { useNavigate } from 'react-router';

interface NavbarProps {
  cartItemCount: number;
  wishlistCount: number;
}

export function Navbar({ cartItemCount, wishlistCount }: NavbarProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:5176';
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--green-primary)]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <h1 className="flex items-center gap-2 cursor-pointer">
              <img
                src="/src/imports/logo.png"
                alt="eGrocer logo"
                className="w-10 h-10 rounded-2xl shadow-lg shadow-[var(--green-primary)]/20 object-cover"
              />
              <span className="hidden sm:block bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] bg-clip-text text-transparent">
                eGrocer
              </span>
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10 text-[var(--green-dark)] border border-[var(--green-primary)]/20 rounded-full font-semibold transition-all hover:from-[var(--green-primary)] hover:to-[var(--green-secondary)] hover:text-white hover:shadow-lg hover:shadow-[var(--green-primary)]/30 flex items-center gap-1"
            >
              Categories
            </button>
          </div>

          {/* Search Bar — desktop */}
          <motion.div
            className="hidden md:flex flex-1 max-w-xl mx-4"
            animate={{ scale: isSearchFocused ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative w-full">
              <button
                onClick={handleSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--green-primary)]/60 hover:text-[var(--green-primary)] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Search for fresh groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--beige)] rounded-full border-2 border-transparent focus:border-[var(--green-primary)] focus:bg-white outline-none transition-all"
              />
            </div>
          </motion.div>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/wishlist')}
              className="p-2 hover:bg-[var(--green-primary)]/10 rounded-full transition-colors relative"
            >
              <Heart className="w-6 h-6 text-[var(--green-primary)]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--terracotta)] text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-[var(--green-primary)]/10 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6 text-[var(--green-primary)]" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--green-secondary)] text-white text-xs rounded-full flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="hidden sm:flex p-2 hover:bg-[var(--green-primary)]/10 rounded-full transition-colors"
            >
              <User className="w-6 h-6 text-[var(--green-primary)]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="hidden sm:flex p-2 hover:bg-red-50 rounded-full transition-colors group"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6 text-red-500 transition-colors" />
            </motion.button>

            {/* Quick Access Menu */}
            <QuickAccessMenu />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-[var(--green-primary)]/10 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <button
              onClick={handleSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--green-primary)]/60 hover:text-[var(--green-primary)] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 bg-[var(--beige)] rounded-full border-2 border-transparent focus:border-[var(--green-primary)] focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-[var(--green-primary)]/10 overflow-hidden bg-white"
          >
            <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/categories');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 bg-gradient-to-r from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10 text-[var(--green-dark)] border border-[var(--green-primary)]/20 rounded-xl font-semibold hover:from-[var(--green-primary)] hover:to-[var(--green-secondary)] hover:text-white transition-all shadow-sm"
                >
                  Categories
                </button>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 bg-gradient-to-r from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10 text-[var(--green-dark)] border border-[var(--green-primary)]/20 rounded-xl font-semibold hover:from-[var(--green-primary)] hover:to-[var(--green-secondary)] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-100 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

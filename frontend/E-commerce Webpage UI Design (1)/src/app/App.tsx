import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryBrowsePage } from './pages/CategoryBrowsePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { RequestsPage } from './pages/RequestsPage';
import { TrackingPage } from './pages/TrackingPage';
import { FlashDealsPage } from './pages/FlashDealsPage';
import { PreviousOrdersPage } from './pages/PreviousOrdersPage';
import { ManageProfilePage } from './pages/ManageProfilePage';
import WishlistPage from './pages/WishlistPage.tsx';
import { Product, wishlistApi, cartApi, CartItem as BackendCartItem } from '../services/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Centralized refresh function to keep UI in sync with DB
  const refreshWishlist = async () => {
    try {
      const items = await wishlistApi.getWishlist();
      setWishlistItems(items);
    } catch (err) {
      console.warn('Failed to refresh wishlist:', err);
    }
  };

  const refreshCart = async () => {
    try {
      const items = await cartApi.getCart();
      setCartItems(items.map(item => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })));
    } catch (err) {
      console.warn('Failed to refresh cart:', err);
    }
  };

  useEffect(() => {
    // 1. Capture userId from URL if coming from login redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('userId');
    const urlToken = urlParams.get('token');
    
    if (urlId) {
      // If we were previously using a guest ID, merge the carts
      const guestId = localStorage.getItem('userId') || '3';
      
      // We set the token FIRST so the mergeCart request is authenticated as the NEW user
      if (urlToken) localStorage.setItem('token', urlToken);
      localStorage.setItem('userId', urlId);

      // Trigger merge in background
      cartApi.mergeCart(guestId).then(() => {
        refreshCart();
      }).catch(err => console.warn('Cart merge failed:', err));

      // Clear old session data
      localStorage.removeItem('user');
      // Clean URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }

    // 2. Initial fetch
    refreshWishlist();
    refreshCart();
  }, []);

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    try {
      await cartApi.addItem(Number(product.id), quantity);
      await refreshCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleWishlistToggle = async (productId: number) => {
    console.log('[DEBUG] handleWishlistToggle called for product:', productId);
    try {
      const action = await wishlistApi.toggleWishlist(productId);
      console.log('[DEBUG] toggleWishlist response action:', action);
      // Explicitly wait for refresh to ensure navbar count updates
      await refreshWishlist();
      return action;
    } catch (err: any) {
      console.error('Wishlist toggle failed:', err);
      window.alert('Failed to update wishlist: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const handleUpdateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return;
    try {
      await cartApi.updateQuantity(Number(id), qty);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await cartApi.removeItem(Number(id));
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistCount={wishlistItems.length}
        />

        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} wishlistItems={wishlistItems} />} />
          <Route path="/categories" element={<CategoryBrowsePage onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} wishlistItems={wishlistItems} />} />
          <Route path="/product/:productId" element={<ProductDetailPage onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} />} />
          <Route path="/search" element={<SearchResultsPage onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} wishlistItems={wishlistItems} />} />
          <Route path="/cart" element={<CartPage items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} />} />
          <Route path="/wishlist" element={<WishlistPage onAddToCart={handleAddToCart} items={wishlistItems} onWishlistUpdate={refreshWishlist} />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/profile" element={<ManageProfilePage />} />
          <Route path="/flash-deals" element={<FlashDealsPage onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} wishlistItems={wishlistItems} />} />
          <Route path="/previous-orders" element={<PreviousOrdersPage />} />
        </Routes>


        <Footer />

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-full shadow-2xl shadow-[var(--green-primary)]/30 z-40"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      </div>
    </BrowserRouter>
  );
}

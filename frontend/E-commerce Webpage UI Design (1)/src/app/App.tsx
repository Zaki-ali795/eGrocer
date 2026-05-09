import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
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
import { Product, wishlistApi } from '../services/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    // Initial fetch of wishlist
    wishlistApi.getWishlist()
      .then(setWishlistItems)
      .catch(err => {
        console.warn('Wishlist API not ready:', err.message);
        setWishlistItems([]); // Fallback to empty wishlist
      });
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const productId = String(product.id);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
          }
        ];
      }
    });
  };

  const handleWishlistToggle = async (productId: number) => {
    try {
      const action = await wishlistApi.toggleWishlist(productId);
      // Refresh wishlist to keep state in sync
      const updatedWishlist = await wishlistApi.getWishlist();
      setWishlistItems(updatedWishlist);
      return action;
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
      throw err;
    }
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <BrowserRouter>
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
          <Route path="/wishlist" element={<WishlistPage onAddToCart={handleAddToCart} onWishlistUpdate={() => wishlistApi.getWishlist().then(setWishlistItems)} />} />
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

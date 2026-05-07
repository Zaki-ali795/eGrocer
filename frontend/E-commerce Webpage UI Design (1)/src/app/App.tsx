import { useState } from 'react';
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
import { Product } from '../services/api';



interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    const productId = String(product.id);
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          id: productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }
      ]);
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
        />

        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="/categories" element={<CategoryBrowsePage onAddToCart={handleAddToCart} />} />
          <Route path="/product/:productId" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
          <Route path="/search" element={<SearchResultsPage onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<CartPage items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/flash-deals" element={<FlashDealsPage onAddToCart={handleAddToCart} />} />
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

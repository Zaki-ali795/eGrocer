import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { CartPreview } from './components/CartPreview';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RequestsPage } from './pages/RequestsPage';
import { TrackingPage } from './pages/TrackingPage';
import { FlashDealsPage } from './pages/FlashDealsPage';
import { PreviousOrdersPage } from './pages/PreviousOrdersPage';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  organic?: boolean;
  nutritionHighlights?: string[];
  reorderable?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Organic Avocados (6 pack)',
      price: 899,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1601379760607-78be3d4ff432?w=200',
    },
    {
      id: '2',
      name: 'Fresh Strawberries (500g)',
      price: 649,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?w=200',
    },
  ]);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }
      ]);
    }

    setIsCartOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar
          onCartOpen={() => setIsCartOpen(true)}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />

        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/flash-deals" element={<FlashDealsPage />} />
          <Route path="/previous-orders" element={<PreviousOrdersPage />} />
        </Routes>

        <Footer />

        <CartPreview
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
        />

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

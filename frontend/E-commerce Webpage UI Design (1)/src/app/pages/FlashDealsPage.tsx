import { FlashDeals } from '../components/FlashDeals';
import { Product } from '../../services/api';

interface FlashDealsPageProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onWishlistToggle: (productId: number) => Promise<'added' | 'removed'>;
  wishlistItems: Product[];
}

export function FlashDealsPage({ onAddToCart, onWishlistToggle, wishlistItems }: FlashDealsPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <FlashDeals onAddToCart={onAddToCart} />
    </div>
  );
}

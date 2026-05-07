import { FlashDeals } from '../components/FlashDeals';
import { Product } from '../../services/api';

interface FlashDealsPageProps {
  onAddToCart: (product: Product) => void;
}

export function FlashDealsPage({ onAddToCart }: FlashDealsPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <FlashDeals onAddToCart={onAddToCart} />
    </div>
  );
}

import { PreviousOrders } from '../components/PreviousOrders';

export function PreviousOrdersPage() {
  const handleReorder = (orderId: string) => {
    console.log('Reordering:', orderId);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <PreviousOrders onReorder={handleReorder} />
    </div>
  );
}

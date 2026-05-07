import { useEffect, useState } from 'react';
import { PreviousOrders } from '../components/PreviousOrders';
import { orderApi, Order } from '../../services/api';

export function PreviousOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getPreviousOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = (orderId: string) => {
    console.log('Reordering:', orderId);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <PreviousOrders orders={orders} isLoading={isLoading} onReorder={handleReorder} />
    </div>
  );
}

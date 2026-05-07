import { useEffect, useState } from 'react';
import { OrderTracking } from '../components/OrderTracking';
import { orderApi, TrackingOrder } from '../../services/api';

export function TrackingPage() {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await orderApi.getTrackingData();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch tracking data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracking();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <OrderTracking orders={orders} isLoading={isLoading} />
    </div>
  );
}

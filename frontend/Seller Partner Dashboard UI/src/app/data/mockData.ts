export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: { productName: string; quantity: number }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryInstructions?: string;
}

export interface BidRequest {
  id: string;
  productName: string;
  quantity: number;
  customerName: string;
  location: string;
  requestDate: string;
  status: 'pending' | 'offered' | 'accepted' | 'rejected';
  yourOffer?: number;
}

export interface Promotion {
  id: string;
  productId: string;
  productName: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  type: 'payment' | 'refund';
  status: 'completed' | 'pending';
}

// Mock Products
export const mockProducts: Product[] = [];

// Mock Orders
export const mockOrders: Order[] = [];

// Mock Bid Requests
export const mockBidRequests: BidRequest[] = [];

// Mock Promotions
export const mockPromotions: Promotion[] = [];

// Mock Transactions
export const mockTransactions: Transaction[] = [];

// Sales analytics data (Placeholder until integrated with DB)
export const salesData = [
  { date: 'Mon', sales: 0, orders: 0 },
  { date: 'Tue', sales: 0, orders: 0 },
  { date: 'Wed', sales: 0, orders: 0 },
  { date: 'Thu', sales: 0, orders: 0 },
  { date: 'Fri', sales: 0, orders: 0 },
  { date: 'Sat', sales: 0, orders: 0 },
  { date: 'Sun', sales: 0, orders: 0 }
];

export const categoryData = [
  { name: 'Loading...', value: 100 }
];


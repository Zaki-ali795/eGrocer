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
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Organic Red Apples',
    category: 'Fruits',
    brand: 'Fresh Farms',
    price: 4.99,
    discount: 10,
    stock: 150,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    description: 'Crisp, sweet organic red apples. Rich in fiber and vitamin C.'
  },
  {
    id: 'p2',
    name: 'Fresh Spinach Leaves',
    category: 'Vegetables',
    brand: 'Green Valley',
    price: 2.99,
    stock: 45,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    description: 'Fresh, organic spinach leaves. Perfect for salads and smoothies.'
  },
  {
    id: 'p3',
    name: 'Whole Grain Bread',
    category: 'Bakery',
    brand: 'Artisan Bakers',
    price: 3.49,
    discount: 15,
    stock: 12,
    status: 'low-stock',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    description: 'Freshly baked whole grain bread. No preservatives.'
  },
  {
    id: 'p4',
    name: 'Organic Milk',
    category: 'Dairy',
    brand: 'Happy Cows',
    price: 5.99,
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    description: 'Fresh organic whole milk from grass-fed cows.'
  },
  {
    id: 'p5',
    name: 'Free Range Eggs',
    category: 'Dairy',
    brand: 'Sunny Farm',
    price: 6.49,
    stock: 89,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    description: 'Farm fresh eggs from free-range chickens.'
  },
  {
    id: 'p6',
    name: 'Organic Bananas',
    category: 'Fruits',
    brand: 'Tropical Fresh',
    price: 3.29,
    stock: 200,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
    description: 'Ripe organic bananas. Great source of potassium.'
  },
  {
    id: 'p7',
    name: 'Cherry Tomatoes',
    category: 'Vegetables',
    brand: 'Garden Fresh',
    price: 4.29,
    stock: 8,
    status: 'low-stock',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    description: 'Sweet and juicy cherry tomatoes. Perfect for snacking.'
  },
  {
    id: 'p8',
    name: 'Almond Butter',
    category: 'Spreads',
    brand: 'Nutty Delight',
    price: 8.99,
    discount: 20,
    stock: 34,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1520961414595-1e4de7a6de84?w=400',
    description: 'Creamy almond butter made from roasted almonds.'
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    customerName: 'Sarah Johnson',
    items: [
      { productName: 'Organic Red Apples', quantity: 3 },
      { productName: 'Fresh Spinach Leaves', quantity: 2 }
    ],
    totalPrice: 20.95,
    status: 'pending',
    orderDate: '2026-04-14T08:30:00',
    deliveryInstructions: 'Leave at front door if not home'
  },
  {
    id: 'ord-002',
    customerName: 'Mike Chen',
    items: [
      { productName: 'Whole Grain Bread', quantity: 2 },
      { productName: 'Free Range Eggs', quantity: 1 }
    ],
    totalPrice: 13.47,
    status: 'processing',
    orderDate: '2026-04-14T09:15:00'
  },
  {
    id: 'ord-003',
    customerName: 'Emma Davis',
    items: [
      { productName: 'Organic Bananas', quantity: 5 },
      { productName: 'Cherry Tomatoes', quantity: 2 }
    ],
    totalPrice: 25.03,
    status: 'delivered',
    orderDate: '2026-04-13T14:20:00'
  },
  {
    id: 'ord-004',
    customerName: 'James Wilson',
    items: [{ productName: 'Almond Butter', quantity: 1 }],
    totalPrice: 8.99,
    status: 'cancelled',
    orderDate: '2026-04-13T11:45:00'
  },
  {
    id: 'ord-005',
    customerName: 'Lisa Anderson',
    items: [
      { productName: 'Organic Red Apples', quantity: 2 },
      { productName: 'Organic Bananas', quantity: 3 }
    ],
    totalPrice: 19.85,
    status: 'processing',
    orderDate: '2026-04-14T10:00:00',
    deliveryInstructions: 'Call upon arrival'
  }
];

// Mock Bid Requests
export const mockBidRequests: BidRequest[] = [
  {
    id: 'bid-001',
    productName: 'Organic Strawberries',
    quantity: 10,
    customerName: 'David Brown',
    location: 'Downtown District',
    requestDate: '2026-04-14T07:30:00',
    status: 'pending'
  },
  {
    id: 'bid-002',
    productName: 'Grass-fed Beef',
    quantity: 5,
    customerName: 'Rachel Green',
    location: 'Westside',
    requestDate: '2026-04-14T08:00:00',
    status: 'offered',
    yourOffer: 45.99
  },
  {
    id: 'bid-003',
    productName: 'Organic Quinoa',
    quantity: 15,
    customerName: 'Tom Harris',
    location: 'Eastwood',
    requestDate: '2026-04-13T16:20:00',
    status: 'accepted',
    yourOffer: 12.99
  },
  {
    id: 'bid-004',
    productName: 'Artisan Cheese Selection',
    quantity: 3,
    customerName: 'Nina Patel',
    location: 'City Center',
    requestDate: '2026-04-14T09:00:00',
    status: 'pending'
  }
];

// Mock Promotions
export const mockPromotions: Promotion[] = [
  {
    id: 'promo-001',
    productId: 'p1',
    productName: 'Organic Red Apples',
    discount: 10,
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    isActive: true
  },
  {
    id: 'promo-002',
    productId: 'p3',
    productName: 'Whole Grain Bread',
    discount: 15,
    startDate: '2026-04-12',
    endDate: '2026-04-18',
    isActive: true
  },
  {
    id: 'promo-003',
    productId: 'p8',
    productName: 'Almond Butter',
    discount: 20,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    isActive: true
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    orderId: 'ord-003',
    amount: 25.03,
    date: '2026-04-13T14:20:00',
    type: 'payment',
    status: 'completed'
  },
  {
    id: 'txn-002',
    orderId: 'ord-004',
    amount: 8.99,
    date: '2026-04-13T11:45:00',
    type: 'refund',
    status: 'completed'
  },
  {
    id: 'txn-003',
    orderId: 'ord-002',
    amount: 13.47,
    date: '2026-04-14T09:15:00',
    type: 'payment',
    status: 'pending'
  },
  {
    id: 'txn-004',
    orderId: 'ord-005',
    amount: 19.85,
    date: '2026-04-14T10:00:00',
    type: 'payment',
    status: 'pending'
  },
  {
    id: 'txn-005',
    orderId: 'ord-001',
    amount: 20.95,
    date: '2026-04-14T08:30:00',
    type: 'payment',
    status: 'completed'
  }
];

// Sales analytics data
export const salesData = [
  { date: 'Mon', sales: 4200, orders: 32 },
  { date: 'Tue', sales: 3800, orders: 28 },
  { date: 'Wed', sales: 5100, orders: 41 },
  { date: 'Thu', sales: 4600, orders: 35 },
  { date: 'Fri', sales: 6200, orders: 52 },
  { date: 'Sat', sales: 7800, orders: 68 },
  { date: 'Sun', sales: 5900, orders: 49 }
];

export const categoryData = [
  { name: 'Fruits', value: 35 },
  { name: 'Vegetables', value: 25 },
  { name: 'Dairy', value: 20 },
  { name: 'Bakery', value: 12 },
  { name: 'Others', value: 8 }
];

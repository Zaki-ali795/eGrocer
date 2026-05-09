import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Requests from './pages/Requests';
import Promotions from './pages/Promotions';
import Payments from './pages/Payments';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'products', Component: Products },
      { path: 'inventory', Component: Inventory },
      { path: 'orders', Component: Orders },
      { path: 'requests', Component: Requests },
      { path: 'promotions', Component: Promotions },
      { path: 'payments', Component: Payments },
      { path: 'settings', Component: Settings }
    ]
  }
]);

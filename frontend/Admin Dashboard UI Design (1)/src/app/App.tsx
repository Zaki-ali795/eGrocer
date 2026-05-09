import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductsManagement } from './components/ProductsManagement';
import { CategoriesManagement } from './components/CategoriesManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { OrdersManagement } from './components/OrdersManagement';
import { UsersManagement } from './components/UsersManagement';
import { CustomerRequests } from './components/CustomerRequests';
import { PromotionsManagement } from './components/PromotionsManagement';
import { FlashDealsManagement } from './components/FlashDealsManagement';
import { PaymentsManagement } from './components/PaymentsManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { Settings } from './components/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);

  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setNavigationParams(params);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview onNavigate={(page) => handleNavigate(page, null)} />;
      case 'products':
        return <ProductsManagement initialCategory={navigationParams?.category} />;
      case 'categories':
        return <CategoriesManagement onNavigateProducts={(cat: string) => handleNavigate('products', { category: cat })} />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'requests':
        return <CustomerRequests />;
      case 'promotions':
        return <PromotionsManagement />;
      case 'flash-deals':
        return <FlashDealsManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-amber-50/20 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={(page) => handleNavigate(page, null)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onNavigate={(page) => handleNavigate(page, null)} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
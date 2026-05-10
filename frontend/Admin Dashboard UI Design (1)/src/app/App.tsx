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
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setNavigationParams(params);
    setSearchQuery(''); // Clear search on navigation for a fresh start
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview onNavigate={(page) => handleNavigate(page, null)} />;
      case 'products':
        return <ProductsManagement initialCategory={navigationParams?.category} searchQuery={searchQuery} />;
      case 'categories':
        return <CategoriesManagement onNavigateProducts={(cat: string) => handleNavigate('products', { category: cat })} searchQuery={searchQuery} />;
      case 'inventory':
        return <InventoryManagement searchQuery={searchQuery} />;
      case 'orders':
        return <OrdersManagement searchQuery={searchQuery} />;
      case 'users':
        return <UsersManagement searchQuery={searchQuery} />;
      case 'requests':
        return <CustomerRequests searchQuery={searchQuery} />;
      case 'promotions':
        return <PromotionsManagement searchQuery={searchQuery} />;
      case 'flash-deals':
        return <FlashDealsManagement searchQuery={searchQuery} />;
      case 'payments':
        return <PaymentsManagement searchQuery={searchQuery} />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar currentPage={currentPage} onNavigate={(page) => handleNavigate(page, null)} />
      <div className="flex-1 flex flex-col overflow-hidden bg-white/40 backdrop-blur-3xl">
        <TopBar 
          onNavigate={(page) => handleNavigate(page, null)} 
          onSearch={setSearchQuery}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
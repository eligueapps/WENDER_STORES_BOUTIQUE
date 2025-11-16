import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import TandCPage from './pages/TandCPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
    const { currentPage, currentPageId, isAuthenticated } = useAppContext();

    if (currentPage === 'login' || (currentPage === 'admin' && !isAuthenticated)) {
        return <LoginPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'products':
                return <ProductListPage />;
            case 'product':
                return <ProductDetailPage productId={currentPageId!} />;
            case 'cart':
                return <CartPage />;
            case 'about':
                return <AboutPage />;
            case 'tandc':
                return <TandCPage />;
            case 'contact':
                return <ContactPage />;
            case 'admin':
                return <AdminDashboard />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans text-brand-dark bg-brand-accent">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Product, Category, CartItem, Order, Page, Customization, AppContextType } from '../types';
import { initialProducts, initialCategories, initialTags, initialOrders, initialTermsAndConditions } from '../data';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [tags] = useState<string[]>(initialTags);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [currentPage, _setCurrentPage] = useState<Page>('home');
    const [currentPageId, setCurrentPageId] = useState<number | null>(null);
    const [termsAndConditions, setTermsAndConditions] = useState<string>(initialTermsAndConditions);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setCurrentPage = (page: Page, id?: number) => {
        _setCurrentPage(page);
        setCurrentPageId(id || null);
        window.scrollTo(0, 0);
    };

    const login = (username: string, password: string): boolean => {
        if (username === 'admin-ws' && password === '123456') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentPage('home');
    };

    const addToCart = (product: Product, customization: Customization, quantity: number) => {
        const surface = (customization.width / 100) * (customization.height / 100) * quantity;
        const totalPrice = surface * product.pricePerSqM;

        const newCartItem: CartItem = {
            id: `${product.id}-${new Date().getTime()}`,
            product,
            customization,
            quantity,
            surface,
            totalPrice,
        };
        setCart(prevCart => [...prevCart, newCartItem]);
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    };
    
    const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === cartItemId) {
                if (newQuantity <= 0) {
                    return item; // Or remove if quantity is 0
                }
                const newSurface = (item.customization.width / 100) * (item.customization.height / 100) * newQuantity;
                const newTotalPrice = newSurface * item.product.pricePerSqM;
                return { ...item, quantity: newQuantity, surface: newSurface, totalPrice: newTotalPrice };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const addOrder = (order: Omit<Order, 'id' | 'date' | 'paymentStatus' | 'deliveryFee'>) => {
        const deliveryFee = 15.00;
        const newOrder: Order = {
            ...order,
            id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
            date: new Date(),
            paymentStatus: 'En attente de paiement',
            deliveryFee: deliveryFee,
            total: order.total + deliveryFee,
        }
        setOrders(prevOrders => [newOrder, ...prevOrders]);
    };

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));
    };

    const updateOrderDetails = (orderId: string, details: Partial<Order>) => {
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, ...details } : order
        ));
    };

    // Category Management
    const addCategory = (category: Omit<Category, 'id'>): { success: boolean, message: string } => {
        const nameExists = categories.some(c => c.name.toLowerCase() === category.name.toLowerCase());
        if (nameExists) {
            return { success: false, message: 'Une catégorie avec ce nom existe déjà.' };
        }
        const newCategory: Category = {
            ...category,
            id: Date.now(),
        };
        setCategories(prev => [newCategory, ...prev]);
        return { success: true, message: 'Catégorie ajoutée avec succès.' };
    };

    const updateCategory = (category: Category): { success: boolean, message: string } => {
        const nameExists = categories.some(c => c.id !== category.id && c.name.toLowerCase() === category.name.toLowerCase());
        if (nameExists) {
            return { success: false, message: 'Une autre catégorie avec ce nom existe déjà.' };
        }
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        return { success: true, message: 'Catégorie mise à jour avec succès.' };
    };

    const deleteCategory = (categoryId: number) => {
        // Here you might want to check if any product is using this category
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.totalPrice, 0), [cart]);

    const value: AppContextType = {
        products,
        setProducts,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        tags,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        addOrder,
        updateOrderStatus,
        updateOrderDetails,
        currentPage,
        currentPageId,
        setCurrentPage,
        termsAndConditions,
        setTermsAndConditions,
        searchTerm,
        setSearchTerm,
        isAuthenticated,
        login,
        logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
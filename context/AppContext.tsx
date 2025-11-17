import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Product, Category, CartItem, Order, Page, Customization, AppContextType, Country, City } from '../types';
import { initialProducts, initialCategories, initialTags, initialOrders, initialTermsAndConditions, initialCountries, initialCities } from '../data';

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
    const [countries, setCountries] = useState<Country[]>(initialCountries);
    const [cities, setCities] = useState<City[]>(initialCities);


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

    const addOrder = (order: Omit<Order, 'id' | 'date' | 'paymentStatus'>) => {
        const newOrder: Order = {
            ...order,
            id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
            date: new Date(),
            paymentStatus: 'En attente de paiement',
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
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };
    
    // Delivery Management
    const addCountry = (country: Omit<Country, 'id'>) => {
        if (countries.some(c => c.name.toLowerCase() === country.name.toLowerCase())) {
            return { success: false, message: "Ce pays existe déjà." };
        }
        const newCountry = { ...country, id: Date.now() };
        setCountries(prev => [newCountry, ...prev]);
        return { success: true, message: "Pays ajouté avec succès." };
    };

    const updateCountry = (country: Country) => {
        if (countries.some(c => c.id !== country.id && c.name.toLowerCase() === country.name.toLowerCase())) {
            return { success: false, message: "Un autre pays avec ce nom existe déjà." };
        }
        setCountries(prev => prev.map(c => c.id === country.id ? country : c));
        return { success: true, message: "Pays mis à jour avec succès." };
    };

    const deleteCountry = (countryId: number) => {
        if (cities.some(c => c.countryId === countryId && c.isActive)) {
            return { success: false, message: "Impossible de supprimer un pays avec des villes actives." };
        }
        setCountries(prev => prev.filter(c => c.id !== countryId));
        return { success: true, message: "Pays supprimé." };
    };

    const addCity = (city: Omit<City, 'id'>) => {
        if (cities.some(c => c.name.toLowerCase() === city.name.toLowerCase() && c.countryId === city.countryId)) {
            return { success: false, message: "Cette ville existe déjà dans ce pays." };
        }
        const newCity = { ...city, id: Date.now() };
        setCities(prev => [newCity, ...prev]);
        return { success: true, message: "Ville ajoutée avec succès." };
    };

    const updateCity = (city: City) => {
        if (cities.some(c => c.id !== city.id && c.name.toLowerCase() === city.name.toLowerCase() && c.countryId === city.countryId)) {
            return { success: false, message: "Une autre ville avec ce nom existe déjà dans ce pays." };
        }
        setCities(prev => prev.map(c => c.id === city.id ? city : c));
        return { success: true, message: "Ville mise à jour avec succès." };
    };
    
    const deleteCity = (cityId: number) => {
        setCities(prev => prev.filter(c => c.id !== cityId));
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
        logout,
        countries,
        addCountry,
        updateCountry,
        deleteCountry,
        cities,
        addCity,
        updateCity,
        deleteCity
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
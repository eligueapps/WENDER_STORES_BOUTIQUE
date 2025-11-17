// FIX: Import Dispatch and SetStateAction types from React to resolve namespace errors.
import type { Dispatch, SetStateAction } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  pricePerSqM: number;
  images: string[];
  categoryId: number;
  tags: string[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  // New detailed fields
  productVideoUrl?: string;
  technicalSheetUrl?: string;
  installationGuideUrl?: string;
  youtubeVideoUrl?: string;
  howToMeasureText?: string;
  howToInstallText?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string; // base64 or URL
}

export interface Customization {
  width: number;
  height: number;
  mechanismType: 'manuel' | 'electrique';
  mechanismSide: 'left' | 'right';
  mountingType: 'murale' | 'plafond';
  withBox: boolean;
}

export interface CartItem {
  id: string; // Unique ID for the cart item
  product: Product;
  customization: Customization;
  quantity: number;
  surface: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  email: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'En attente' | 'En traitement' | 'Expédiée' | 'Livrée' | 'Annulée';
  date: Date;
  paymentStatus: 'Payé' | 'En attente de paiement' | 'Remboursé';
  deliveryFee: number;
  // New fields for confirmation workflow
  callDate?: string;
  callStatus?: 'Appelé' | 'À rappeler' | 'Non joignable' | 'Client non intéressé';
  paymentMethod?: 'Espèces' | 'Virement bancaire' | 'Carte bancaire';
}

export type Page = 'home' | 'products' | 'product' | 'cart' | 'about' | 'tandc' | 'contact' | 'admin' | 'login';

export interface AppContextType {
    products: Product[];
    // FIX: Use imported Dispatch and SetStateAction types instead of React.Dispatch and React.SetStateAction.
    setProducts: Dispatch<SetStateAction<Product[]>>;
    categories: Category[];
    addCategory: (category: Omit<Category, 'id'>) => { success: boolean, message: string };
    updateCategory: (category: Category) => { success: boolean, message: string };
    deleteCategory: (categoryId: number) => void;
    tags: string[];
    cart: CartItem[];
    addToCart: (product: Product, customization: Customization, quantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date' | 'paymentStatus' | 'deliveryFee'>) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    updateOrderDetails: (orderId: string, details: Partial<Order>) => void;
    currentPage: Page;
    currentPageId: number | null;
    setCurrentPage: (page: Page, id?: number) => void;
    termsAndConditions: string;
    // FIX: Use imported Dispatch and SetStateAction types instead of React.Dispatch and React.SetStateAction.
    setTermsAndConditions: Dispatch<SetStateAction<string>>;
    searchTerm: string;
    // FIX: Use imported Dispatch and SetStateAction types instead of React.Dispatch and React.SetStateAction.
    setSearchTerm: Dispatch<SetStateAction<string>>;
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}
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
}

export interface Customization {
  width: number;
  height: number;
  mechanismType: 'roller' | 'venetian' | 'pleated';
  mechanismSide: 'left' | 'right';
  mountingType: 'wall' | 'ceiling';
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
  status: 'En attente' | 'En traitement' | 'Expédiée' | 'Livrée';
  date: Date;
  paymentStatus: 'Payé' | 'En attente de paiement' | 'Remboursé';
  deliveryFee: number;
}

export type Page = 'home' | 'products' | 'product' | 'cart' | 'about' | 'tandc' | 'contact' | 'admin' | 'login';
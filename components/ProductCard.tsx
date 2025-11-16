import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { setCurrentPage } = useAppContext();

    return (
        <div 
            className="bg-white rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg border border-transparent hover:border-slate-200"
            onClick={() => setCurrentPage('product', product.id)}
        >
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="text-base font-medium text-brand-dark truncate group-hover:text-brand-primary">{product.name}</h3>
                <p className="text-lg font-bold text-brand-primary mt-2">${product.pricePerSqM.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ m²</span></p>
            </div>
        </div>
    );
};

export default ProductCard;
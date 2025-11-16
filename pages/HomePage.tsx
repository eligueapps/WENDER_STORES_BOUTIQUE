import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
    const { products, setCurrentPage } = useAppContext();

    const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

    return (
        <div className="space-y-12">
            {/* Banner Section */}
            <div className="relative bg-blue-100 rounded-2xl overflow-hidden h-64 md:h-96 flex items-center">
                <img src="https://picsum.photos/seed/mainbanner/1600/600" alt="Elegant blinds in a modern living room" className="absolute w-full h-full object-cover" />
                <div className="relative container mx-auto px-6 text-center z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>Stores sur mesure, style inégalé</h1>
                    <p className="text-lg md:text-xl text-white mt-4 max-w-2xl mx-auto" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>Concevez vos habillages de fenêtre parfaits avec WENDER STORES.</p>
                    <button 
                        onClick={() => setCurrentPage('products')}
                        className="mt-8 px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Voir tous les produits
                    </button>
                </div>
            </div>

            {/* New Arrivals Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Nouveautés</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {newArrivals.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Best Sellers Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Meilleures Ventes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {bestSellers.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Promotions Section */}
            <section className="bg-brand-light p-8 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h3 className="text-3xl font-bold text-brand-primary">Soldes d'été !</h3>
                        <p className="text-gray-600 mt-2">Profitez de 20% de réduction sur tous les stores vénitiens. Illuminez votre maison à petit prix.</p>
                    </div>
                    <div>
                        <button 
                            onClick={() => setCurrentPage('products')}
                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Profiter des soldes
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
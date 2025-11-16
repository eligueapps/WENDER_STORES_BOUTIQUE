
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductListPage: React.FC = () => {
    const { products, categories, tags, searchTerm } = useAppContext();

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;
        const lowercasedTerm = searchTerm.trim().toLowerCase();

        // 1. Filter by search term
        if (lowercasedTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowercasedTerm) ||
                p.description.toLowerCase().includes(lowercasedTerm) ||
                p.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
            );
        }
        
        // 2. Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(p => p.categoryId === selectedCategory);
        }
        
        // 3. Filter by selected tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
        }

        // 4. Sort
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.pricePerSqM - b.pricePerSqM;
                case 'price-desc':
                    return b.pricePerSqM - a.pricePerSqM;
                case 'newest':
                default:
                    return b.id - a.id;
            }
        });
    }, [products, selectedCategory, selectedTags, sortBy, searchTerm]);
    
    const pageTitle = searchTerm ? `Résultats pour "${searchTerm}"` : "Tous les produits";

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-4">{pageTitle}</h1>

            <div className="mb-8">
                 <h3 className="text-xl font-bold mb-4 text-brand-dark">Filtrer par tags</h3>
                 <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4" style={{'scrollbarWidth': 'none', '-ms-overflow-style': 'none'}}>
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-all duration-200 font-medium capitalize transform hover:scale-105 ${selectedTags.includes(tag) ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-slate-100 shadow-sm border'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters */}
                <aside className="lg:w-1/4">
                    <div className="bg-brand-light p-6 rounded-xl shadow-sm sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Catégories</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full text-left font-medium p-2 rounded-md transition-colors ${!selectedCategory ? 'text-white bg-brand-primary' : 'hover:bg-brand-accent'}`}
                                >
                                    Toutes les catégories
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left font-medium p-2 rounded-md transition-colors ${selectedCategory === cat.id ? 'text-white bg-brand-primary' : 'hover:bg-brand-accent'}`}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-gray-600 font-medium">{filteredAndSortedProducts.length} produits trouvés</p>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none bg-brand-accent border-transparent rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            >
                                <option value="newest">Le plus récent</option>
                                <option value="price-asc">Prix : Croissant</option>
                                <option value="price-desc">Prix : Décroissant</option>
                            </select>
                        </div>
                    </div>
                    
                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 transition-opacity duration-500">
                            {filteredAndSortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-brand-light rounded-xl shadow-sm">
                            <h3 className="text-2xl font-semibold">Aucun produit trouvé</h3>
                            <p className="text-gray-500 mt-2">Essayez d'ajuster vos filtres ou votre recherche.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListPage;

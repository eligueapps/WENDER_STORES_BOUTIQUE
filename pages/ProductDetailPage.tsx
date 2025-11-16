import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Customization } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, DocumentTextIcon, VideoCameraIcon, InformationCircleIcon } from '../components/icons/Icons';

interface ProductDetailPageProps {
    productId: number;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
    const { products, addToCart, setCurrentPage } = useAppContext();
    const product = products.find(p => p.id === productId);

    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [customization, setCustomization] = useState<Customization>({
        width: 100,
        height: 120,
        mechanismType: 'roller',
        mechanismSide: 'left',
        mountingType: 'wall',
    });
    const [quantity, setQuantity] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [calculatedSurface, setCalculatedSurface] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (product) {
            const surface = (customization.width / 100) * (customization.height / 100) * quantity;
            const price = surface * product.pricePerSqM;
            setCalculatedSurface(surface);
            setCalculatedPrice(price);
        }
    }, [product, customization, quantity]);

    if (!product) {
        return <div className="text-center py-20"><h2>Produit non trouvé</h2><button onClick={() => setCurrentPage('products')}>Retour aux produits</button></div>;
    }

    const handleAddToCart = () => {
        addToCart(product, customization, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const handlePrevImage = () => {
        setMainImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleNextImage = () => {
        setMainImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const formInputStyle = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary";
    
    const detailsAndGuides = [
        { label: 'Fiche technique', value: product.technicalSheetUrl, icon: <DocumentTextIcon /> },
        { label: 'Notice de pose', value: product.installationGuideUrl, icon: <DocumentTextIcon /> },
        { label: 'Tutoriel vidéo', value: product.youtubeVideoUrl, icon: <VideoCameraIcon /> },
    ].filter(item => item.value);

    const hasDetailsOrGuides = detailsAndGuides.length > 0 || product.howToMeasureText || product.howToInstallText;


    return (
        <div className="bg-brand-light p-6 sm:p-8 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="relative group overflow-hidden rounded-lg">
                        <img src={product.images[mainImageIndex]} alt={product.name} className="w-full h-auto object-cover aspect-square transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomInIcon />
                            <span className="ml-2 text-white">Zoom</span>
                        </div>
                        {product.images.length > 1 && (
                             <>
                                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-opacity opacity-50 group-hover:opacity-100"><ChevronLeftIcon /></button>
                                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-opacity opacity-50 group-hover:opacity-100"><ChevronRightIcon /></button>
                             </>
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        {product.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`${product.name} thumbnail ${index + 1}`} 
                                className={`w-1/4 cursor-pointer rounded-md border-2 ${mainImageIndex === index ? 'border-brand-primary' : 'border-transparent'}`}
                                onClick={() => setMainImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-4xl font-bold text-brand-dark">{product.name}</h1>
                    <p className="text-3xl font-bold text-brand-primary my-4">{product.pricePerSqM.toFixed(2)}€ <span className="text-base font-normal text-gray-500">/ m²</span></p>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    <div className="flex flex-wrap gap-2 my-4">
                        {product.tags.map(tag => <span key={tag} className="bg-brand-accent text-brand-dark text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">{tag}</span>)}
                    </div>

                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 w-full py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Configurer et Ajouter au Panier
                        </button>
                    ) : (
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-2xl font-semibold mb-4">Personnaliser votre produit</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Largeur (cm)</label>
                                    <input type="number" value={customization.width} onChange={e => setCustomization({...customization, width: +e.target.value})} className={formInputStyle}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hauteur (cm)</label>
                                    <input type="number" value={customization.height} onChange={e => setCustomization({...customization, height: +e.target.value})} className={formInputStyle}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type de mécanisme</label>
                                    <select value={customization.mechanismType} onChange={e => setCustomization({...customization, mechanismType: e.target.value as any})} className={formInputStyle}>
                                        <option value="roller">Enrouleur</option>
                                        <option value="venetian">Vénitien</option>
                                        <option value="pleated">Plissé</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Côté du mécanisme</label>
                                    <select value={customization.mechanismSide} onChange={e => setCustomization({...customization, mechanismSide: e.target.value as any})} className={formInputStyle}>
                                        <option value="left">Gauche</option>
                                        <option value="right">Droite</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Type de montage</label>
                                    <select value={customization.mountingType} onChange={e => setCustomization({...customization, mountingType: e.target.value as any})} className={formInputStyle}>
                                        <option value="wall">Mur</option>
                                        <option value="ceiling">Plafond</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, +e.target.value))} className={formInputStyle}/>
                                </div>
                            </div>
                            <div className="mt-6 bg-brand-accent p-4 rounded-lg">
                                <p>Surface : <span className="font-semibold">{calculatedSurface.toFixed(2)} m²</span></p>
                                <p className="text-xl font-bold">Prix estimé : <span className="text-brand-primary">{calculatedPrice.toFixed(2)}€</span></p>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`mt-4 w-full py-3 text-white font-bold rounded-full transition-all transform hover:scale-105 ${addedToCart ? 'bg-green-500' : 'bg-brand-primary hover:bg-opacity-90'}`}
                                disabled={addedToCart}
                            >
                                {addedToCart ? 'Ajouté !' : 'Ajouter au panier'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {hasDetailsOrGuides && (
                <div className="mt-12 border-t pt-8">
                    <h2 className="text-3xl font-bold text-brand-dark mb-6">Détails et Guides</h2>
                    <div className="space-y-6">
                        {detailsAndGuides.length > 0 && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {detailsAndGuides.map(item => (
                                    <a key={item.label} href={item.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-brand-accent rounded-lg hover:bg-slate-200 transition-colors">
                                        <span className="text-brand-secondary">{item.icon}</span>
                                        <span className="font-semibold">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                       
                        {product.howToMeasureText && (
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold mb-2"><InformationCircleIcon /> Comment prendre les mesures</h3>
                                <p className="text-gray-600 pl-8">{product.howToMeasureText}</p>
                            </div>
                        )}
                        {product.howToInstallText && (
                             <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold mb-2"><InformationCircleIcon /> Comment installer le store ou rideau</h3>
                                <p className="text-gray-600 pl-8">{product.howToInstallText}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
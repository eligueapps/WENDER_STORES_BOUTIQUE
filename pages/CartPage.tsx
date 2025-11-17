import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/icons/Icons';

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateCartQuantity, cartTotal, addOrder, clearCart, setCurrentPage, countries, cities } = useAppContext();
    
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        address: '',
        country: '',
        city: '',
        email: '',
        phone: '',
    });
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const activeCountries = useMemo(() => countries.filter(c => c.isActive), [countries]);
    const availableCities = useMemo(() => {
        if (!customerInfo.country) return [];
        const countryId = activeCountries.find(c => c.name === customerInfo.country)?.id;
        if (!countryId) return [];
        return cities.filter(city => city.countryId === countryId && city.isActive);
    }, [cities, customerInfo.country, activeCountries]);

    useEffect(() => {
        if (customerInfo.city) {
            const cityData = availableCities.find(c => c.name === customerInfo.city);
            setDeliveryFee(cityData?.deliveryFee || 0);
        } else {
            setDeliveryFee(0);
        }
    }, [customerInfo.city, availableCities]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'country') {
            setCustomerInfo(prev => ({ ...prev, country: value, city: '' })); // Reset city when country changes
        } else {
            setCustomerInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        addOrder({
            customerName: customerInfo.name,
            address: customerInfo.address,
            country: customerInfo.country,
            city: customerInfo.city,
            email: customerInfo.email,
            phone: customerInfo.phone,
            items: cart,
            total: cartTotal + deliveryFee,
            deliveryFee,
            status: 'En attente',
        });
        clearCart();
        setIsOrderPlaced(true);
    };

    if (isOrderPlaced) {
        return (
            <div className="text-center py-20 bg-brand-light rounded-xl shadow-sm">
                <h2 className="text-3xl font-bold text-green-600">Merci !</h2>
                <p className="text-lg text-gray-700 mt-4">Votre commande a été passée avec succès.</p>
                <p className="text-gray-500 mt-2">Nous vous contacterons sous peu avec la confirmation et les détails de la livraison.</p>
                <button
                    onClick={() => setCurrentPage('home')}
                    className="mt-8 px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-colors transform hover:scale-105"
                >
                    Continuer les achats
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 bg-brand-light rounded-xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-dark">Votre panier est vide</h2>
                <p className="text-lg text-gray-500 mt-4">Il semble que vous n'ayez pas encore ajouté de stores sur mesure.</p>
                <button
                    onClick={() => setCurrentPage('products')}
                    className="mt-8 px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-colors transform hover:scale-105"
                >
                    Parcourir les produits
                </button>
            </div>
        );
    }

    const formatCustomization = (item: (typeof cart)[0]) => {
        const { customization } = item;
        let details = `${customization.width}cm x ${customization.height}cm | ${customization.mechanismType}`;
        if (customization.mechanismType === 'manuel') {
            details += ` | Côté: ${customization.mechanismSide}`;
        }
        details += ` | Montage: ${customization.mountingType} | ${customization.withBox ? 'Avec coffre' : 'Sans coffre'}`;
        return details;
    }
    
    const inputStyle = "w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary";

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-brand-dark mb-10">Panier d'achat</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-brand-light p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Vos articles</h2>
                    <div className="space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b border-slate-200 pb-6 last:border-b-0">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full sm:w-32 h-32 object-cover rounded-lg"/>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {formatCustomization(item)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 border rounded-full disabled:opacity-50 hover:bg-slate-100"><MinusIcon/></button>
                                        <span className="px-4 font-semibold w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1.5 border rounded-full hover:bg-slate-100"><PlusIcon/></button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <p className="text-lg font-bold text-brand-primary">{item.totalPrice.toFixed(2)}€</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><TrashIcon/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-brand-light p-6 rounded-xl shadow-sm h-fit">
                    <h2 className="text-2xl font-bold mb-6">Commander</h2>
                     <div className="space-y-3 mb-6 pb-4 border-b border-slate-200">
                        <div className="flex justify-between"><span>Sous-total</span> <span>{cartTotal.toFixed(2)}€</span></div>
                        <div className="flex justify-between"><span>Livraison</span> <span>{deliveryFee.toFixed(2)}€</span></div>
                        <div className="flex justify-between items-center text-xl font-semibold"><span>Total</span> <span className="text-2xl font-bold text-brand-primary">{(cartTotal + deliveryFee).toFixed(2)}€</span></div>
                    </div>
                    <form onSubmit={handleCheckout}>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Nom complet" value={customerInfo.name} onChange={handleInputChange} className={inputStyle} required/>
                            <select name="country" value={customerInfo.country} onChange={handleInputChange} className={inputStyle} required>
                                <option value="" disabled>Sélectionner un pays</option>
                                {activeCountries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                             <select name="city" value={customerInfo.city} onChange={handleInputChange} className={inputStyle} required disabled={!customerInfo.country}>
                                <option value="" disabled>Sélectionner une ville</option>
                                {availableCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            <input type="text" name="address" placeholder="Adresse (rue, n°, etc.)" value={customerInfo.address} onChange={handleInputChange} className={inputStyle} required/>
                            <input type="email" name="email" placeholder="Adresse e-mail" value={customerInfo.email} onChange={handleInputChange} className={inputStyle} required/>
                            <input type="tel" name="phone" placeholder="Numéro de téléphone" value={customerInfo.phone} onChange={handleInputChange} className={inputStyle} required/>
                        </div>
                        <button type="submit" className="mt-6 w-full py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors transform hover:scale-105">
                            Passer la commande
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
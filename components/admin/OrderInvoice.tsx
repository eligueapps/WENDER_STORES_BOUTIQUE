import React from 'react';
import { Order, Category, Currency } from '../../types';

interface OrderInvoiceProps {
    order: Order;
    categories: Category[];
    conversionRates: { [key in Currency]?: number };
}

const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, categories, conversionRates }) => {
    
    const convertPriceForInvoice = (priceInMAD: number): string => {
        const targetCurrency = order.currency;
        const rate = conversionRates[targetCurrency] || 1;
        const convertedPrice = priceInMAD * rate;

        const locale = {
            'MAD': 'fr-MA',
            'EUR': 'fr-FR',
            'USD': 'en-US'
        }[targetCurrency];

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: targetCurrency,
        }).format(convertedPrice);
    };

    const subtotal = order.items.reduce((acc, item) => acc + item.totalPrice, 0);

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id === id)?.name || 'Inconnue';
    }

    return (
        <div className="bg-white p-8 font-sans text-sm text-gray-800" style={{ width: '210mm' }}>
            {/* Header */}
            <header className="flex justify-between items-center pb-4 border-b-2 border-brand-primary">
                <div className="text-3xl font-extrabold text-brand-primary">
                    WENDER STORES
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-right">FACTURE</h1>
                    <p className="text-right text-gray-500 mt-1">{order.id}</p>
                </div>
            </header>

            {/* Order and Customer Details */}
            <section className="grid grid-cols-2 gap-8 my-8">
                <div>
                    <h2 className="font-bold text-gray-500 mb-2">FACTURÉ À</h2>
                    <p className="font-bold">{order.customerName}</p>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.country}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold text-gray-500">Date de la commande :</span> {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                    <p><span className="font-bold text-gray-500">Statut de la commande :</span> {order.status}</p>
                    <p><span className="font-bold text-gray-500">Statut du paiement :</span> {order.paymentStatus}</p>
                </div>
            </section>

            {/* Items Table */}
            <section>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-accent text-brand-dark font-bold">
                            <th className="p-3">PRODUIT</th>
                            <th className="p-3 text-right">QUANTITÉ</th>
                            <th className="p-3 text-right">PRIX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 align-top">
                                    <div className="flex items-start gap-4">
                                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="font-bold">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">{getCategoryName(item.product.categoryId)}</p>
                                            <div className="mt-2 text-xs text-gray-600 space-y-0.5" style={{ pageBreakInside: 'avoid' }}>
                                                <p><span className="font-semibold">Dimensions :</span> {item.customization.width}cm x {item.customization.height}cm</p>
                                                <p><span className="font-semibold">Mécanisme :</span> {item.customization.mechanismType}
                                                    {item.customization.mechanismType === 'manuel' && ` (${item.customization.mechanismSide})`}
                                                </p>
                                                <p><span className="font-semibold">Montage :</span> {item.customization.mountingType}</p>
                                                <p><span className="font-semibold">Finition :</span> {item.customization.withBox ? 'Avec coffre' : 'Sans coffre'}</p>
                                                <p><span className="font-semibold">Surface :</span> {item.surface.toFixed(2)} m²</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-right align-top">{item.quantity}</td>
                                <td className="p-3 text-right align-top font-semibold">{convertPriceForInvoice(item.totalPrice)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            {/* Totals */}
            <section className="flex justify-end mt-8">
                <div className="w-1/2">
                    <div className="flex justify-between py-2">
                        <span className="font-bold text-gray-600">Sous-total :</span>
                        <span>{convertPriceForInvoice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-bold text-gray-600">Frais de livraison :</span>
                        <span>{convertPriceForInvoice(order.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between py-3 mt-2 border-t-2 border-brand-primary">
                        <span className="text-xl font-bold">Total :</span>
                        <span className="text-xl font-bold">{convertPriceForInvoice(order.total)}</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-center text-xs text-gray-500 border-t pt-4">
                <p>Merci pour votre commande !</p>
                <p>WENDER STORES - 123 Rue du Décor, Ville du Style, 45678 - contact@wenderstores.com</p>
            </footer>
        </div>
    );
};

export default OrderInvoice;
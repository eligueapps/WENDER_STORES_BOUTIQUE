import React from 'react';
import { Order } from '../../types';
import {
    XIcon,
    UserIcon,
    PhoneIcon,
    MailIcon,
    LocationMarkerIcon,
    RulerIcon,
    CogIcon,
    WrenchScrewdriverIcon,
    ArrowsRightLeftIcon,
    PDFDownloadIcon,
    SpinnerIcon
} from '../icons/Icons';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onDownloadPDF: (order: Order) => void;
    isDownloading: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onDownloadPDF, isDownloading }) => {

    const statusColors: { [key in Order['status']]: string } = {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'En traitement': 'bg-blue-100 text-blue-800',
        'Expédiée': 'bg-purple-100 text-purple-800',
        'Livrée': 'bg-green-100 text-green-800',
        // FIX: Added missing 'Annulée' status to the statusColors object to cover all possible order statuses.
        'Annulée': 'bg-red-100 text-red-800',
    };
    
    const paymentStatusColors: { [key in Order['paymentStatus']]: string } = {
        'Payé': 'bg-green-100 text-green-800',
        'En attente de paiement': 'bg-yellow-100 text-yellow-800',
        'Remboursé': 'bg-gray-100 text-gray-800',
    };

    const subtotal = order.items.reduce((acc, item) => acc + item.totalPrice, 0);

    const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
        <div className="flex items-center text-sm">
            <span className="text-gray-400 mr-2">{icon}</span>
            <span className="font-semibold text-gray-600 mr-1">{label}:</span>
            <span className="text-gray-800 capitalize">{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-brand-accent rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="sticky top-0 bg-brand-accent/80 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">Commande <span className="text-brand-primary font-mono">{order.id}</span></h2>
                        <p className="text-sm text-gray-500">Passée le {new Date(order.date).toLocaleString('fr-FR')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
                        <XIcon />
                    </button>
                </header>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Top Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-bold text-gray-500 text-sm mb-2">Statut de la commande</h3>
                            <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                         </div>
                         <div className="bg-white p-4 rounded-lg shadow-sm">
                             <h3 className="font-bold text-gray-500 text-sm mb-2">Statut du paiement</h3>
                            <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>{order.paymentStatus}</span>
                         </div>
                    </section>
                    
                    {/* Customer & Products */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-sm space-y-4">
                            <h3 className="text-lg font-bold border-b pb-2 mb-2">Client</h3>
                             <div className="flex items-start space-x-3">
                                <UserIcon/> <div><span className="font-semibold">Nom:</span> {order.customerName}</div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <PhoneIcon/> <div><span className="font-semibold">Tél:</span> {order.phone}</div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MailIcon/> <div><span className="font-semibold">Email:</span> {order.email}</div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <LocationMarkerIcon/> <div><span className="font-semibold">Adresse:</span> {order.address}</div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm">
                             <h3 className="text-lg font-bold border-b pb-2 mb-2">Produits commandés</h3>
                             <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="border-b last:border-b-0 pb-4">
                                        <div className="flex gap-4">
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                            <div className="flex-grow">
                                                <p className="font-bold">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-brand-primary">{item.totalPrice.toFixed(2)}€</p>
                                        </div>
                                        <div className="bg-brand-accent p-3 rounded-md mt-3 space-y-2">
                                            <h4 className="font-semibold text-sm">Configuration sur mesure :</h4>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                <DetailItem icon={<RulerIcon />} label="Largeur" value={`${item.customization.width} cm`} />
                                                <DetailItem icon={<RulerIcon />} label="Hauteur" value={`${item.customization.height} cm`} />
                                                <DetailItem icon={<CogIcon />} label="Mécanisme" value={item.customization.mechanismType} />
                                                {item.customization.mechanismType === 'manuel' && (
                                                    <DetailItem icon={<ArrowsRightLeftIcon />} label="Côté" value={item.customization.mechanismSide} />
                                                )}
                                                <DetailItem icon={<WrenchScrewdriverIcon />} label="Montage" value={item.customization.mountingType} />
                                                <DetailItem icon={<CogIcon />} label="Finition" value={item.customization.withBox ? 'Avec coffre' : 'Sans coffre'} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </section>

                    {/* Financial Summary */}
                    <section className="flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-5 rounded-lg shadow-sm">
                             <h3 className="text-lg font-bold border-b pb-2 mb-2">Résumé financier</h3>
                             <div className="space-y-2">
                                <div className="flex justify-between"><span>Sous-total</span> <span>{subtotal.toFixed(2)}€</span></div>
                                <div className="flex justify-between"><span>Livraison</span> <span>{order.deliveryFee.toFixed(2)}€</span></div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span> <span>{order.total.toFixed(2)}€</span></div>
                             </div>
                        </div>
                    </section>
                </div>
                
                <footer className="sticky bottom-0 bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={() => onDownloadPDF(order)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isDownloading ? <SpinnerIcon /> : <PDFDownloadIcon />}
                        <span>{isDownloading ? 'Génération...' : 'Télécharger en PDF'}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
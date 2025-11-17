import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';
import { PhoneArrowUpRightIcon, CreditCardIcon } from '../icons/Icons';
import ContactClientModal from './ContactClientModal';

const ConfirmationManager: React.FC = () => {
    const { orders, updateOrderDetails } = useAppContext();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const callStatusColors: { [key in NonNullable<Order['callStatus']>]: string } = {
        'Appelé': 'bg-green-100 text-green-800',
        'À rappeler': 'bg-blue-100 text-blue-800',
        'Non joignable': 'bg-yellow-100 text-yellow-800',
        'Client non intéressé': 'bg-red-100 text-red-800',
    };
    
    const paymentStatusColors: { [key in Order['paymentStatus']]: string } = {
        'Payé': 'bg-green-100 text-green-800',
        'En attente de paiement': 'bg-yellow-100 text-yellow-800',
        'Remboursé': 'bg-gray-100 text-gray-800',
    };

    const handleTogglePaymentStatus = (order: Order) => {
        if (window.confirm(`Voulez-vous vraiment changer le statut de paiement en "${order.paymentStatus === 'Payé' ? 'En attente de paiement' : 'Payé'}" ?`)) {
            const newStatus = order.paymentStatus === 'Payé' ? 'En attente de paiement' : 'Payé';
            updateOrderDetails(order.id, { paymentStatus: newStatus });
        }
    };
    
    const handleSaveContact = (details: Partial<Order>) => {
        if (selectedOrder) {
            updateOrderDetails(selectedOrder.id, details);
        }
        setSelectedOrder(null);
    };

    return (
        <>
            <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Confirmation & Paiement des Commandes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="p-2">ID</th>
                                <th className="p-2">Client</th>
                                <th className="p-2">Statut Appel</th>
                                <th className="p-2">Statut Paiement</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-200">
                                    <td className="p-2 font-mono text-sm">{order.id}</td>
                                    <td className="p-2">{order.customerName}</td>
                                    <td className="p-2">
                                        {order.callStatus ? (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${callStatusColors[order.callStatus]}`}>
                                                {order.callStatus}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="p-2 flex items-center space-x-2">
                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-600 hover:text-brand-primary rounded-full hover:bg-slate-100" title="Contacter le client">
                                            <PhoneArrowUpRightIcon />
                                        </button>
                                        <button 
                                            onClick={() => handleTogglePaymentStatus(order)} 
                                            className={`p-2 rounded-full hover:bg-slate-100 ${order.paymentStatus === 'Payé' ? 'text-green-600' : 'text-yellow-600'}`}
                                            title="Changer statut paiement"
                                        >
                                            <CreditCardIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedOrder && (
                <ContactClientModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSave={handleSaveContact}
                />
            )}
        </>
    );
};

export default ConfirmationManager;
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { XIcon, CalendarDaysIcon } from '../icons/Icons';

interface ContactClientModalProps {
    order: Order;
    onClose: () => void;
    onSave: (details: Partial<Order>) => void;
}

type FormData = {
    callDate: string;
    callStatus?: Order['callStatus'];
    orderStatus?: Order['status'];
    paymentMethod?: Order['paymentMethod'];
};

const ContactClientModal: React.FC<ContactClientModalProps> = ({ order, onClose, onSave }) => {
    
    const [formData, setFormData] = useState<FormData>({
        callDate: order.callDate || new Date().toISOString().split('T')[0],
        callStatus: order.callStatus,
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const detailsToUpdate: Partial<Order> = {
            callDate: formData.callDate,
            callStatus: formData.callStatus,
        };
        if (formData.callStatus === 'Appelé') {
            if (formData.orderStatus === 'Annulée' || formData.orderStatus === 'En attente') {
                 detailsToUpdate.status = formData.orderStatus;
            } else {
                 detailsToUpdate.status = 'En traitement'; // Default confirmation status
            }

            if (detailsToUpdate.status !== 'Annulée') {
                detailsToUpdate.paymentMethod = formData.paymentMethod;
            }
        }
        onSave(detailsToUpdate);
    };

    const inputStyle = "w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition";
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

    return (
         <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-brand-light rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">Contact Client - <span className="font-mono">{order.id}</span></h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><XIcon /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="relative">
                            <label htmlFor="callDate" className={labelStyle}>Date d'appel réalisé</label>
                            <input type="date" id="callDate" name="callDate" value={formData.callDate} onChange={handleChange} className={`${inputStyle} pr-8`} required />
                            <div className="absolute right-2 top-9 text-gray-400 pointer-events-none"><CalendarDaysIcon /></div>
                        </div>
                        <div>
                            <label htmlFor="callStatus" className={labelStyle}>Statut de l'appel</label>
                            <select id="callStatus" name="callStatus" value={formData.callStatus || ''} onChange={handleChange} className={inputStyle} required>
                                <option value="" disabled>Sélectionner un statut</option>
                                <option value="Appelé">Appelé</option>
                                <option value="À rappeler">À rappeler</option>
                                <option value="Non joignable">Non joignable</option>
                                <option value="Client non intéressé">Client non intéressé</option>
                            </select>
                        </div>

                        {formData.callStatus === 'Appelé' && (
                            <div className="p-4 bg-slate-100 rounded-lg space-y-4 animate-fade-in">
                                <div>
                                    <label htmlFor="orderStatus" className={labelStyle}>Décision de la commande</label>
                                    <select id="orderStatus" name="orderStatus" value={formData.orderStatus === 'Annulée' ? 'Annulée' : 'Confirmer'} onChange={e => setFormData(f => ({...f, orderStatus: e.target.value === 'Annulée' ? 'Annulée' : 'En traitement'}))} className={inputStyle}>
                                        <option value="Confirmer">Confirmer</option>
                                        <option value="Annulée">Annuler</option>
                                    </select>
                                </div>
                                
                                {formData.orderStatus !== 'Annulée' && (
                                     <div className="animate-fade-in">
                                        <label htmlFor="paymentMethod" className={labelStyle}>Mode de Paiement</label>
                                        <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} className={inputStyle} required>
                                            <option value="" disabled>Sélectionner un mode</option>
                                            <option value="Espèces">Espèces</option>
                                            <option value="Virement bancaire">Virement bancaire</option>
                                            <option value="Carte bancaire">Carte bancaire</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <footer className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-full hover:bg-slate-300">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90">
                            Enregistrer
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ContactClientModal;
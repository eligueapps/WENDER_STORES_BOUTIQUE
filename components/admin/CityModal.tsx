import React, { useState } from 'react';
import { City } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { XIcon } from '../icons/Icons';
import ToggleSwitch from '../ui/ToggleSwitch';

interface CityModalProps {
    city: City | null;
    countryId: number;
    onClose: () => void;
    onSave: (result: { success: boolean; message: string; }) => void;
}

const CityModal: React.FC<CityModalProps> = ({ city, countryId, onClose, onSave }) => {
    const { addCity, updateCity } = useAppContext();
    const [formData, setFormData] = useState({
        name: city?.name || '',
        deliveryFee: city?.deliveryFee || 0,
        estimatedTime: city?.estimatedTime || '',
        isActive: city?.isActive ?? true
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "Le nom de la ville est obligatoire.";
        if (formData.deliveryFee < 0) newErrors.deliveryFee = "Les frais de livraison ne peuvent être négatifs.";
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let result;
        if (city) {
            result = updateCity({ ...city, ...formData });
        } else {
            result = addCity({ ...formData, countryId });
        }
        onSave(result);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{city ? 'Modifier la ville' : 'Ajouter une ville'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><XIcon /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="cityName" className="block text-sm font-semibold mb-1">Nom de la ville</label>
                            <input id="cityName" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" required />
                             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="deliveryFee" className="block text-sm font-semibold mb-1">Frais de livraison (€)</label>
                            <input id="deliveryFee" name="deliveryFee" type="number" value={formData.deliveryFee} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" required min="0" step="0.01" />
                            {errors.deliveryFee && <p className="text-red-500 text-sm mt-1">{errors.deliveryFee}</p>}
                        </div>
                        <div>
                            <label htmlFor="estimatedTime" className="block text-sm font-semibold mb-1">Délai estimé (ex. 24h)</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" value={formData.estimatedTime} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                        </div>
                         <div className="md:col-span-2 flex justify-between items-center pt-2">
                            <label className="text-sm font-semibold">Statut de livraison</label>
                            <ToggleSwitch enabled={formData.isActive} onChange={val => setFormData(f => ({...f, isActive: val}))} />
                        </div>
                    </div>
                    <footer className="p-4 bg-slate-100 border-t flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 font-semibold rounded-full hover:bg-slate-300">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90">Enregistrer</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CityModal;

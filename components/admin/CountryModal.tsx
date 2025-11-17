import React, { useState } from 'react';
import { Country } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { XIcon } from '../icons/Icons';
import ToggleSwitch from '../ui/ToggleSwitch';

interface CountryModalProps {
    country: Country | null;
    onClose: () => void;
    onSave: (result: { success: boolean; message: string; }) => void;
}

const CountryModal: React.FC<CountryModalProps> = ({ country, onClose, onSave }) => {
    const { addCountry, updateCountry } = useAppContext();
    const [name, setName] = useState(country?.name || '');
    const [isActive, setIsActive] = useState(country?.isActive ?? true);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Le nom du pays est obligatoire.");
            return;
        }

        let result;
        if (country) {
            result = updateCountry({ ...country, name, isActive });
        } else {
            result = addCountry({ name, isActive });
        }
        onSave(result);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{country ? 'Modifier le pays' : 'Ajouter un pays'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><XIcon /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="countryName" className="block text-sm font-semibold mb-1">Nom du pays</label>
                            <input
                                id="countryName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md"
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold">Statut de livraison</label>
                            <ToggleSwitch enabled={isActive} onChange={setIsActive} />
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

export default CountryModal;

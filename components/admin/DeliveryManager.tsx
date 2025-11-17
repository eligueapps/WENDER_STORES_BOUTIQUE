import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Country, City } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../icons/Icons';
import ToggleSwitch from '../ui/ToggleSwitch';
import CountryModal from './CountryModal';
import CityModal from './CityModal';

const DeliveryManager: React.FC = () => {
    const { countries, cities, updateCountry, deleteCountry, updateCity, deleteCity } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const sortedCountries = useMemo(() => [...countries].sort((a, b) => a.name.localeCompare(b.name)), [countries]);
    const citiesForSelectedCountry = useMemo(() => {
        if (!selectedCountry) return [];
        return cities.filter(c => c.countryId === selectedCountry.id).sort((a, b) => a.name.localeCompare(b.name));
    }, [cities, selectedCountry]);

    const handleMessage = (msg: { success: boolean; message: string; }) => {
        setMessage({ type: msg.success ? 'success' : 'error', text: msg.message });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDeleteCountry = (id: number) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce pays ?")) {
            const result = deleteCountry(id);
            handleMessage(result);
            if (result.success && selectedCountry?.id === id) {
                setSelectedCountry(null);
            }
        }
    };
    
    const handleDeleteCity = (id: number) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer cette ville ?")) {
            deleteCity(id);
        }
    };

    return (
        <>
            {message && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Countries Panel */}
                <div className="lg:col-span-1 bg-brand-light p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Pays de livraison</h3>
                        <button onClick={() => { setEditingCountry(null); setIsCountryModalOpen(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700">
                            <PlusIcon /> Ajouter
                        </button>
                    </div>
                    <div className="space-y-2">
                        {sortedCountries.map(country => (
                            <div key={country.id} onClick={() => setSelectedCountry(country)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCountry?.id === country.id ? 'bg-brand-primary text-white' : 'bg-white hover:bg-slate-100'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{country.name}</span>
                                    <div className="flex items-center gap-2">
                                        <ToggleSwitch enabled={country.isActive} onChange={(val) => updateCountry({...country, isActive: val})} />
                                        <button onClick={(e) => { e.stopPropagation(); setEditingCountry(country); setIsCountryModalOpen(true); }} className={`p-1 rounded-full ${selectedCountry?.id === country.id ? 'hover:bg-orange-400' : 'hover:bg-slate-200'}`}><PencilIcon /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCountry(country.id); }} className={`p-1 rounded-full ${selectedCountry?.id === country.id ? 'hover:bg-orange-400' : 'hover:bg-slate-200'}`}><TrashIcon /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities Panel */}
                <div className="lg:col-span-2 bg-brand-light p-6 rounded-xl shadow-sm">
                    {selectedCountry ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Villes pour : <span className="text-brand-primary">{selectedCountry.name}</span></h3>
                                <button onClick={() => { setEditingCity(null); setIsCityModalOpen(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700">
                                    <PlusIcon /> Ajouter une ville
                                </button>
                            </div>
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead><tr className="border-b"><th className="p-2">Ville</th><th className="p-2">Frais</th><th className="p-2">Délai</th><th className="p-2">Statut</th><th className="p-2">Actions</th></tr></thead>
                                    <tbody>
                                        {citiesForSelectedCountry.map(city => (
                                            <tr key={city.id} className="border-b last:border-b-0">
                                                <td className="p-2 font-semibold">{city.name}</td>
                                                <td className="p-2">{city.deliveryFee.toFixed(2)}€</td>
                                                <td className="p-2">{city.estimatedTime || 'N/A'}</td>
                                                <td className="p-2"><ToggleSwitch enabled={city.isActive} onChange={(val) => updateCity({...city, isActive: val})} /></td>
                                                <td className="p-2 flex gap-1">
                                                    <button onClick={() => { setEditingCity(city); setIsCityModalOpen(true); }} className="p-2 hover:bg-slate-200 rounded-full"><PencilIcon /></button>
                                                    <button onClick={() => handleDeleteCity(city.id)} className="p-2 hover:bg-slate-200 rounded-full"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Sélectionnez un pays pour voir et gérer ses villes.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {isCountryModalOpen && (
                <CountryModal
                    country={editingCountry}
                    onClose={() => setIsCountryModalOpen(false)}
                    onSave={(result) => { handleMessage(result); if(result.success) setIsCountryModalOpen(false); }}
                />
            )}

            {isCityModalOpen && selectedCountry && (
                 <CityModal
                    city={editingCity}
                    countryId={selectedCountry.id}
                    onClose={() => setIsCityModalOpen(false)}
                    onSave={(result) => { handleMessage(result); if(result.success) setIsCityModalOpen(false); }}
                />
            )}
        </>
    );
};

export default DeliveryManager;

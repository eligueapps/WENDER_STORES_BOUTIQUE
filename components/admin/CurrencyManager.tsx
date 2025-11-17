import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Currency } from '../../types';

const CurrencyManager: React.FC = () => {
    const { currencies, conversionRates, updateConversionRates } = useAppContext();
    const baseCurrency = 'MAD';
    
    const [rates, setRates] = useState(conversionRates);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setRates(conversionRates);
    }, [conversionRates]);

    const handleRateChange = (currency: Currency, value: string) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) || value === '') {
            setRates(prev => ({
                ...prev,
                [currency]: value === '' ? undefined : numericValue
            }));
        }
    };

    const handleSave = () => {
        updateConversionRates(rates);
        setMessage('Taux de change mis à jour avec succès !');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-brand-light p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Gestion des Devises</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Devise de base (non modifiable)</label>
                    <input 
                        type="text" 
                        value={baseCurrency} 
                        disabled 
                        className="w-full p-2 border border-slate-300 rounded-md bg-slate-100 cursor-not-allowed" 
                    />
                </div>
                
                <div className="pt-4 border-t">
                    <h4 className="text-lg font-semibold mb-2">Taux de conversion (par rapport à {baseCurrency})</h4>
                    {currencies.filter(c => c !== baseCurrency).map(currency => (
                        <div key={currency} className="flex items-center gap-4 mb-2">
                            <label className="w-1/4 font-semibold">{currency}</label>
                            <input 
                                type="number"
                                step="0.0001"
                                value={rates[currency] || ''}
                                onChange={(e) => handleRateChange(currency, e.target.value)}
                                className="w-3/4 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-primary/50"
                                placeholder={`1 ${baseCurrency} = ? ${currency}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end items-center mt-6">
                {message && <p className="text-green-600 mr-4">{message}</p>}
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                >
                    Enregistrer les taux
                </button>
            </div>
        </div>
    );
};

export default CurrencyManager;
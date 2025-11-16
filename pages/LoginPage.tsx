import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
    const { login, setCurrentPage } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = login(username, password);
        if (success) {
            setCurrentPage('admin');
        } else {
            setError('Identifiant ou mot de passe incorrect.');
        }
    };

    const inputStyle = "w-full px-4 py-3 bg-brand-accent border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-accent p-4">
            <div className="w-full max-w-sm bg-brand-light p-8 rounded-2xl shadow-lg animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-brand-primary">WENDER STORES</h1>
                    <p className="text-gray-500 mt-2">Accès Administrateur</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Identifiant</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputStyle}
                            placeholder="admin-ws"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputStyle}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <div>
                        <button type="submit" className="w-full py-3 mt-2 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md">
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
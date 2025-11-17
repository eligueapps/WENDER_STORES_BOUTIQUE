import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FacebookIcon, InstagramIcon, TwitterIcon, WenderStoresLogo } from './icons/Icons';

const Footer: React.FC = () => {
    const { setCurrentPage } = useAppContext();

    return (
        <footer className="bg-brand-light text-brand-dark border-t border-slate-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <WenderStoresLogo className="h-8 mb-4" />
                        <p className="text-sm text-gray-600">Solutions de fenêtrage sur mesure avec élégance et précision.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liens Rapides</h3>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-brand-primary transition-colors">Accueil</button></li>
                            <li><button onClick={() => setCurrentPage('products')} className="text-gray-600 hover:text-brand-primary transition-colors">Produits</button></li>
                            <li><button onClick={() => setCurrentPage('about')} className="text-gray-600 hover:text-brand-primary transition-colors">À propos</button></li>
                            <li><button onClick={() => setCurrentPage('tandc')} className="text-gray-600 hover:text-brand-primary transition-colors">CGV</button></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Nous Contacter</h3>
                        <p className="text-sm text-gray-600 mb-2">123 Rue du Décor, Ville du Style, 45678</p>
                        <p className="text-sm text-gray-600 mb-4">contact@wenderstores.com</p>
                        <div className="flex space-x-4 text-gray-500">
                            <a href="#" className="hover:text-brand-primary transition-colors"><FacebookIcon /></a>
                            <a href="#" className="hover:text-brand-primary transition-colors"><InstagramIcon /></a>
                            <a href="#" className="hover:text-brand-primary transition-colors"><TwitterIcon /></a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-600 mb-2">Abonnez-vous pour recevoir nos promotions et nouveautés.</p>
                        <form className="flex">
                            <input type="email" placeholder="Votre e-mail" className="w-full px-3 py-2 bg-brand-accent border-transparent rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                            <button type="submit" className="bg-brand-primary hover:bg-opacity-90 text-white font-bold px-4 py-2 rounded-r-md transition-colors">
                                S'inscrire
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} WENDER STORES. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-10">Contactez-nous</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-brand-light p-8 sm:p-12 rounded-xl shadow-sm">
                
                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-bold text-brand-primary mb-4">Envoyez-nous un message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                            <input type="text" id="name" name="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" name="message" rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"></textarea>
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-colors transform hover:scale-105">
                            Envoyer
                        </button>
                    </form>
                </div>

                {/* Contact Info & Map */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-brand-primary mb-4">Coordonnées</h2>
                    <div className="text-gray-700">
                        <p className="font-semibold">Adresse :</p>
                        <p>123 Rue du Décor, Ville du Style, 45678</p>
                    </div>
                    <div className="text-gray-700">
                        <p className="font-semibold">E-mail :</p>
                        <p>contact@wenderstores.com</p>
                    </div>
                    <div className="text-gray-700">
                        <p className="font-semibold">Téléphone :</p>
                        <p>(555) 123-4567</p>
                    </div>
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                        {/* Placeholder for a map */}
                        <img src="https://picsum.photos/seed/map/600/400" alt="Map to location" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
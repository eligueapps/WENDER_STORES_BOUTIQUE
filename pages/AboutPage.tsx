import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto bg-brand-light p-8 sm:p-12 rounded-xl shadow-sm">
            <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-8">À propos de WENDER STORES</h1>
            
            <div className="space-y-8 text-gray-700 leading-relaxed">
                <p className="text-lg">
                    Fondée en 2010, WENDER STORES est née d'une passion pour le design d'intérieur et de la conviction que les habillages de fenêtre sont plus que fonctionnels ; ils sont un élément clé du caractère et du style d'une maison. Nous avons décidé de créer une expérience fluide et agréable pour que les clients puissent concevoir et acheter en ligne des stores et rideaux sur mesure de haute qualité.
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-primary mb-3">Notre Mission</h2>
                        <p>
                            Notre mission est de permettre aux propriétaires et aux designers de créer de beaux espaces avec des habillages de fenêtre sur mesure qui correspondent parfaitement à leur vision et à leurs fenêtres. Nous combinons l'artisanat traditionnel avec la technologie moderne pour offrir une qualité, une valeur et un service exceptionnels.
                        </p>
                    </div>
                    <img src="https://picsum.photos/seed/about1/500/300" alt="Craftsman at work" className="rounded-lg shadow-md"/>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <img src="https://picsum.photos/seed/about2/500/300" alt="Fabric samples" className="rounded-lg shadow-md order-last md:order-first"/>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-primary mb-3">Qualité et Savoir-faire</h2>
                        <p>
                            Nous nous associons aux meilleurs fournisseurs de matériaux et employons des artisans qualifiés qui sont fiers de chaque couture, coupe et assemblage. Des tissus luxueux aux mécanismes durables et de précision, chaque composant est choisi pour sa qualité et sa longévité.
                        </p>
                    </div>
                </div>

                <div className="text-center bg-brand-accent p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Pourquoi nous choisir ?</h2>
                    <ul className="list-disc list-inside inline-block text-left">
                        <li>Produits entièrement personnalisables selon vos spécifications exactes.</li>
                        <li>Matériaux haut de gamme pour un aspect et un toucher luxueux.</li>
                        <li>Processus de conception et de commande en ligne intuitif.</li>
                        <li>Support client dédié du début à la fin.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
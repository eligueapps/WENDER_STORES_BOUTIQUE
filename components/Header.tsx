import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SearchIcon, ShoppingCartIcon, MenuIcon, XIcon, UserCircleIcon } from './icons/Icons';

const Header: React.FC = () => {
    const { setCurrentPage, cart, tags, products, setSearchTerm: setGlobalSearchTerm, isAuthenticated } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);

    const allSearchableTerms = useMemo(() => {
        const productTitles = products.map(p => p.name);
        return [...new Set([...tags, ...productTitles])];
    }, [tags, products]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            setSuggestions(allSearchableTerms.filter(term => term.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
            setIsSuggestionsVisible(true);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (term: string) => {
        setGlobalSearchTerm(term);
        setInputValue(term);
        setSuggestions([]);
        setIsSuggestionsVisible(false);
        setCurrentPage('products');
        if (isMenuOpen) setIsMenuOpen(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchSubmit(inputValue);
    };

    const handleSuggestionClick = (term: string) => {
        handleSearchSubmit(term);
    };

    const navLinks = [
        { name: 'Accueil', page: 'home' as const },
        { name: 'Produits', page: 'products' as const },
        { name: 'À propos', page: 'about' as const },
        { name: 'CGV', page: 'tandc' as const },
        { name: 'Contact', page: 'contact' as const },
    ];

    const searchBar = (
         <div className="relative w-full">
            <input
                type="text"
                placeholder="Rechercher des produits..."
                value={inputValue}
                onChange={handleSearchChange}
                onFocus={() => setIsSuggestionsVisible(true)}
                className="pl-10 pr-4 py-2 w-full bg-brand-accent border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
            </div>
            {isSuggestionsVisible && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                    {suggestions.map(term => (
                        <li key={term} onClick={() => handleSuggestionClick(term)} className="px-4 py-2 hover:bg-brand-accent cursor-pointer">
                            {term}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

    return (
        <header className="bg-brand-light shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="text-3xl font-extrabold text-brand-primary cursor-pointer" onClick={() => setCurrentPage('home')}>
                        WENDER STORES
                    </div>

                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <button key={link.name} onClick={() => setCurrentPage(link.page)} className="text-brand-dark font-medium hover:text-brand-primary transition-colors">
                                {link.name}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                         <form onSubmit={handleFormSubmit} className="relative hidden md:block w-56">
                           {searchBar}
                        </form>
                        <button onClick={() => setCurrentPage('cart')} className="relative text-brand-dark hover:text-brand-primary transition-colors">
                            <ShoppingCartIcon />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cart.reduce((count, item) => count + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setCurrentPage(isAuthenticated ? 'admin' : 'login')} className="text-brand-dark hover:text-brand-primary transition-colors">
                            <UserCircleIcon />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-brand-dark">
                            {isMenuOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden mt-4">
                        <form onSubmit={handleFormSubmit} className="relative md:hidden mb-4">
                           {searchBar}
                        </form>
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map(link => (
                                <button key={link.name} onClick={() => { setCurrentPage(link.page); setIsMenuOpen(false); }} className="text-left py-2 px-3 hover:bg-brand-accent rounded-md font-medium">
                                    {link.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
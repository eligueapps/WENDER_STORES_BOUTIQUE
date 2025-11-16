import React from 'react';
import { useAppContext } from '../context/AppContext';

const TandCPage: React.FC = () => {
    const { termsAndConditions } = useAppContext();

    return (
        <div className="max-w-4xl mx-auto bg-brand-light p-8 sm:p-12 rounded-xl shadow-sm">
            <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-8">Conditions Générales de Vente</h1>
            <div 
                className="prose lg:prose-xl max-w-none" 
                dangerouslySetInnerHTML={{ __html: termsAndConditions }}
            />
        </div>
    );
};

export default TandCPage;
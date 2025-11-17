import React from 'react';
import { XIcon } from './icons/Icons';

interface InfoModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-scale transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                        <XIcon />
                    </button>
                </header>
                <div className="p-6 whitespace-pre-wrap text-gray-600 leading-relaxed">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
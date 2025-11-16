import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Category } from '../../types';
import { PencilIcon, TrashIcon, UploadIcon, PhotographIcon } from '../icons/Icons';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useAppContext();
    
    const emptyCategory: Omit<Category, 'id'> = { name: '', description: '', image: '' };
    const [formData, setFormData] = useState(emptyCategory);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            setMessage({ type: 'error', text: 'Le nom de la catégorie est obligatoire.' });
            return;
        }

        let result;
        if (editingId) {
            result = updateCategory({ ...formData, id: editingId });
        } else {
            result = addCategory(formData);
        }
        
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        if (result.success) {
            handleCancel();
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
        });
        setMessage(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            deleteCategory(id);
            setMessage({ type: 'success', text: 'Catégorie supprimée avec succès.' });
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(emptyCategory);
        setMessage(null);
    };

    const inputStyle = "w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition";
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className="bg-brand-light p-6 rounded-xl shadow-sm sticky top-24">
                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className={labelStyle}>Nom de la catégorie</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelStyle}>Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Image ou icône</label>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-slate-300 hover:border-brand-primary/50 hover:bg-slate-50"
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Aperçu" className="h-20 w-20 object-cover rounded-md" />
                                ) : (
                                    <>
                                        <UploadIcon />
                                        <p className="mt-2 text-sm text-slate-500">Cliquez pour téléverser</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <button type="submit" className="w-full py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                                {editingId ? 'Enregistrer' : 'Ajouter'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancel} className="w-full py-2 bg-slate-200 text-slate-800 font-semibold rounded-full hover:bg-slate-300 transition-colors">
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                     {message && (
                        <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                 <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Catégories existantes</h3>
                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                ) : (
                                    <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 flex-shrink-0">
                                        <PhotographIcon />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <p className="font-bold">{cat.name}</p>
                                    <p className="text-sm text-gray-500">{cat.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Modifier"><PencilIcon/></button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Supprimer"><TrashIcon/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
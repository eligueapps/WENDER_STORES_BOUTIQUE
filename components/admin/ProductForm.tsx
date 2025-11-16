
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../../types';
import { PhotographIcon, FilmIcon, XIcon, UploadIcon } from '../icons/Icons';

interface ProductFormProps {
    productToEdit: Product;
    onSave: (product: Product) => void;
    onCancel: () => void;
    categories: Category[];
    allTags: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onSave, onCancel, categories, allTags }) => {
    const [product, setProduct] = useState<Product>(productToEdit);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [tagInput, setTagInput] = useState('');
    const [tagError, setTagError] = useState('');

    // Local state for file previews
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProduct(productToEdit);
        setImagePreviews(productToEdit.images);
        setVideoPreview(productToEdit.productVideoUrl || null);
    }, [productToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: any = value;
        if (type === 'number') {
            processedValue = value === '' ? '' : parseFloat(value);
        } else if ((e.target as HTMLInputElement).type === 'checkbox') {
             processedValue = (e.target as HTMLInputElement).checked;
        }
        setProduct(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();

            if (product.tags.length >= 13) {
                setTagError("Vous ne pouvez pas ajouter plus de 13 tags.");
                return;
            }

            if (newTag && !product.tags.includes(newTag)) {
                setProduct(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
                setTagInput('');
                setTagError('');
            }
        }
    };

    const handleTagRemove = (indexToRemove: number) => {
        setProduct(prev => ({
            ...prev,
            tags: prev.tags.filter((_, index) => index !== indexToRemove)
        }));
        if (tagError) {
            setTagError('');
        }
    };

    const handleFileSelect = (files: FileList | null, isVideo: boolean = false) => {
        if (!files) return;
        
        const filesToProcess = Array.from(files);

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (isVideo) {
                    setVideoPreview(result);
                } else {
                    setImagePreviews(prev => [...prev, result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };
    
    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragLeave(e);
        handleFileSelect(e.dataTransfer.files, false);
    };
    
    const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragLeave(e);
        if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files, true);
        }
    };
    
    const handleImageRemove = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };
    
    const handlePreviewDrop = (dropIndex: number) => {
        if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;

        const newPreviews = [...imagePreviews];
        const draggedItem = newPreviews.splice(draggedImageIndex, 1)[0];
        newPreviews.splice(dropIndex, 0, draggedItem);
    
        setImagePreviews(newPreviews);
    };

    const validate = (productData: Product) => {
        const newErrors: { [key: string]: string } = {};
        if (!productData.name.trim()) newErrors.name = "Le titre du produit est requis.";
        if (productData.pricePerSqM <= 0) newErrors.pricePerSqM = "Le prix doit être supérieur à 0.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave = {
            ...product,
            images: imagePreviews, // Use base64 previews
            productVideoUrl: videoPreview || undefined,
        };
        if (validate(productToSave)) {
            onSave(productToSave);
        }
    };
    
    const inputStyle = "w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition";
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

    return (
        <form onSubmit={handleSubmit} className="bg-brand-light p-6 sm:p-8 rounded-xl shadow-lg space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark">{product.id === 0 ? "Ajouter un nouveau produit" : "Modifier le produit"}</h2>

            {/* Basic Info */}
            <fieldset className="space-y-4 p-4 border rounded-lg">
                <legend className="text-lg font-bold px-2">Informations de base</legend>
                <div>
                    <label htmlFor="name" className={labelStyle}>Titre du produit</label>
                    <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className={inputStyle} required />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="description" className={labelStyle}>Description complète</label>
                    <textarea id="description" name="description" value={product.description} onChange={handleChange} rows={5} className={inputStyle} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pricePerSqM" className={labelStyle}>Prix par m² (€)</label>
                        <input type="number" id="pricePerSqM" name="pricePerSqM" value={product.pricePerSqM} onChange={handleChange} className={inputStyle} required step="0.01" min="0" />
                        {errors.pricePerSqM && <p className="text-red-500 text-sm mt-1">{errors.pricePerSqM}</p>}
                    </div>
                     <div>
                        <label htmlFor="categoryId" className={labelStyle}>Catégorie</label>
                        <select id="categoryId" name="categoryId" value={product.categoryId} onChange={handleChange} className={inputStyle}>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="tags" className={labelStyle}>Tags ({product.tags.length}/13)</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-slate-300 rounded-md">
                        {product.tags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-1 bg-brand-secondary/20 text-brand-secondary font-semibold text-sm px-2 py-1 rounded-full animate-fade-in">
                                <span>{tag}</span>
                                <button type="button" onClick={() => handleTagRemove(index)} className="text-brand-secondary hover:text-red-500 transition-colors">
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder={product.tags.length < 13 ? "Ajouter un tag et Entrée" : "Limite de tags atteinte"}
                            className="flex-grow bg-transparent outline-none p-1"
                            disabled={product.tags.length >= 13}
                        />
                    </div>
                    {tagError && <p className="text-red-500 text-sm mt-1">{tagError}</p>}
                </div>
            </fieldset>

            {/* Media */}
            <fieldset className="space-y-6 p-4 border rounded-lg">
                <legend className="text-lg font-bold px-2">Médias</legend>
                
                {/* Image Uploader */}
                <div>
                    <label className={labelStyle}>Images du produit</label>
                    <input type="file" ref={imageInputRef} onChange={(e) => handleFileSelect(e.target.files)} multiple accept="image/jpeg,image/png,image/webp" className="hidden" />
                    <div
                        onClick={() => imageInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleImageDrop}
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDraggingOver ? 'border-brand-primary bg-orange-50' : 'border-slate-300 hover:border-brand-primary/50 hover:bg-slate-50'}`}
                    >
                        <UploadIcon />
                        <p className="mt-2 text-sm text-slate-500">Glissez-déposez ou <span className="font-semibold text-brand-primary">cliquez pour téléverser</span></p>
                        <p className="text-xs text-slate-400">PNG, JPG, WEBP</p>
                    </div>
                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {imagePreviews.map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative group aspect-square rounded-md overflow-hidden transition-opacity ${draggedImageIndex === index ? 'opacity-50' : 'opacity-100'}`}
                                    draggable
                                    onDragStart={() => setDraggedImageIndex(index)}
                                    onDragEnd={() => setDraggedImageIndex(null)}
                                    onDragOver={(e) => { e.preventDefault(); if(draggedImageIndex !== null && draggedImageIndex !== index) handlePreviewDrop(index);}}
                                >
                                    <img src={img} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1">
                                        Glisser pour réorganiser
                                    </div>
                                    <button type="button" onClick={() => handleImageRemove(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Video Uploader */}
                <div>
                    <label className={labelStyle}>Vidéo courte du produit (optionnel)</label>
                    <input type="file" ref={videoInputRef} onChange={(e) => handleFileSelect(e.target.files, true)} accept="video/mp4" className="hidden" />
                    {videoPreview ? (
                        <div className="relative group w-full md:w-1/2">
                            <video src={videoPreview} controls className="w-full rounded-lg" />
                            <button type="button" onClick={() => setVideoPreview(null)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => videoInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleVideoDrop}
                            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDraggingOver ? 'border-brand-primary bg-orange-50' : 'border-slate-300 hover:border-brand-primary/50 hover:bg-slate-50'}`}
                        >
                            <FilmIcon />
                            <p className="mt-2 text-sm text-slate-500">Glissez-déposez ou <span className="font-semibold text-brand-primary">choisissez une vidéo</span></p>
                            <p className="text-xs text-slate-400">MP4, max 50MB</p>
                        </div>
                    )}
                </div>
            </fieldset>

            {/* Technical Details */}
            <fieldset className="space-y-4 p-4 border rounded-lg">
                <legend className="text-lg font-bold px-2">Détails techniques</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="technicalSheetUrl" className={labelStyle}>Fiche technique (Lien PDF)</label>
                        <input type="url" id="technicalSheetUrl" name="technicalSheetUrl" value={product.technicalSheetUrl || ''} onChange={handleChange} placeholder="https://exemple.com/fiche.pdf" className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="installationGuideUrl" className={labelStyle}>Notice de pose (Lien PDF)</label>
                        <input type="url" id="installationGuideUrl" name="installationGuideUrl" value={product.installationGuideUrl || ''} onChange={handleChange} placeholder="https://exemple.com/notice.pdf" className={inputStyle} />
                    </div>
                </div>
                <div>
                    <label htmlFor="youtubeVideoUrl" className={labelStyle}>Lien vidéo YouTube (tutoriel)</label>
                    <input type="url" id="youtubeVideoUrl" name="youtubeVideoUrl" value={product.youtubeVideoUrl || ''} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className={inputStyle} />
                </div>
            </fieldset>
            
            {/* Guides */}
            <fieldset className="space-y-4 p-4 border rounded-lg">
                <legend className="text-lg font-bold px-2">Guides</legend>
                 <div>
                    <label htmlFor="howToMeasureText" className={labelStyle}>Comment prendre les mesures</label>
                    <textarea id="howToMeasureText" name="howToMeasureText" value={product.howToMeasureText || ''} onChange={handleChange} rows={4} className={inputStyle} />
                </div>
                <div>
                    <label htmlFor="howToInstallText" className={labelStyle}>Comment installer le store ou rideau</label>
                    <textarea id="howToInstallText" name="howToInstallText" value={product.howToInstallText || ''} onChange={handleChange} rows={4} className={inputStyle} />
                </div>
            </fieldset>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-full hover:bg-slate-300 transition-colors">
                    Annuler
                </button>
                <button type="submit" className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                    Enregistrer le produit
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
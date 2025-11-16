import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppContext } from '../context/AppContext';
import { Product, Order } from '../types';
import ProductForm from '../components/admin/ProductForm';
import OrderInvoice from '../components/admin/OrderInvoice';
import { PDFDownloadIcon, SpinnerIcon, EyeIcon } from '../components/icons/Icons';
import OrderDetailsModal from '../components/admin/OrderDetailsModal';
import CategoryManager from '../components/admin/CategoryManager';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories' | 'settings';

const AdminDashboard: React.FC = () => {
    const { products, setProducts, orders, updateOrderStatus, termsAndConditions, setTermsAndConditions, categories, tags, logout } = useAppContext();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [generatingPdfFor, setGeneratingPdfFor] = useState<string | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);


    const totalSales = orders.reduce((sum, order) => order.status === 'Livrée' ? sum + order.total : sum, 0);
    const recentOrders = orders.slice(0, 5);
    const popularProducts = [...products].sort((a,b) => b.id - a.id).slice(0, 5); // Mock popularity

    const statusTranslations: { [key in Order['status']]: string } = {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'En traitement': 'bg-blue-100 text-blue-800',
        'Expédiée': 'bg-purple-100 text-purple-800',
        'Livrée': 'bg-green-100 text-green-800',
    };

    const handleProductSave = (productToSave: Product) => {
        if (products.find(p => p.id === productToSave.id)) {
            // Edit existing product
            setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
        } else {
            // Add new product
            setProducts([...products, { ...productToSave, id: Date.now() }]);
        }
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleProductDelete = (productId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const handleNewProduct = () => {
        setEditingProduct({
            id: 0, // Temp ID for new product
            name: '',
            description: '',
            pricePerSqM: 0,
            images: [],
            categoryId: categories[0]?.id || 1,
            tags: [],
            isNewArrival: true,
            isBestSeller: false,
        });
        setIsFormOpen(true);
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    }

    const handleDownloadPDF = async (order: Order) => {
        setGeneratingPdfFor(order.id);
        const invoiceElement = document.createElement('div');
        invoiceElement.style.position = 'absolute';
        invoiceElement.style.left = '-9999px';
        invoiceElement.style.width = '210mm'; // A4 width
        document.body.appendChild(invoiceElement);
        
        const root = ReactDOM.createRoot(invoiceElement);
        root.render(<OrderInvoice order={order} categories={categories} />);

        // Give it a moment to render fully
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { jsPDF } = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        const canvas = await html2canvas(invoiceElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = canvas.height * pdfWidth / canvas.width;
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`commande-WS-${order.id}.pdf`);

        root.unmount();
        document.body.removeChild(invoiceElement);
        setGeneratingPdfFor(null);
    };

    const renderDashboard = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-500">Ventes totales</h3>
                    <p className="text-3xl font-bold text-brand-dark">{totalSales.toFixed(2)}€</p>
                </div>
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-500">Commandes totales</h3>
                    <p className="text-3xl font-bold text-brand-dark">{orders.length}</p>
                </div>
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-500">Produits totaux</h3>
                    <p className="text-3xl font-bold text-brand-dark">{products.length}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Commandes récentes</h3>
                    {recentOrders.map(order => (
                        <div key={order.id} className="flex justify-between items-center border-b border-slate-200 last:border-b-0 py-2">
                            <span>{order.id} - {order.customerName}</span>
                            <span>{order.total.toFixed(2)}€</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusTranslations[order.status]}`}>{order.status}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Produits récents</h3>
                    {popularProducts.map(product => (
                        <div key={product.id} className="flex justify-between items-center border-b border-slate-200 last:border-b-0 py-2">
                            <span>{product.name}</span>
                            <span className="font-semibold">{product.pricePerSqM.toFixed(2)}€/m²</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div>
            {isFormOpen && editingProduct ? (
                <ProductForm 
                    productToEdit={editingProduct} 
                    onSave={handleProductSave} 
                    onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
                    categories={categories}
                    allTags={tags}
                />
            ) : (
                <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Gérer les produits</h3>
                        <button onClick={handleNewProduct} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Ajouter un produit</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b border-slate-200"><th className="p-2">Nom</th><th className="p-2">Prix/m²</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b border-slate-200">
                                        <td className="p-2">{p.name}</td>
                                        <td className="p-2">{p.pricePerSqM.toFixed(2)}€</td>
                                        <td className="p-2 space-x-2">
                                            <button onClick={() => handleEditProduct(p)} className="text-blue-600 hover:underline">Modifier</button>
                                            <button onClick={() => handleProductDelete(p.id)} className="text-red-600 hover:underline">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderOrders = () => (
        <>
            <div className="bg-brand-light p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Gérer les commandes</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead><tr className="border-b border-slate-200"><th className="p-2">ID</th><th className="p-2">Client</th><th className="p-2">Total</th><th className="p-2">Statut</th><th className="p-2">Mettre à jour</th><th className="p-2">Actions</th></tr></thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-200">
                                    <td className="p-2 font-mono text-sm">{order.id}</td>
                                    <td className="p-2">{order.customerName}</td>
                                    <td className="p-2">{order.total.toFixed(2)}€</td>
                                    <td className="p-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusTranslations[order.status]}`}>{order.status}</span></td>
                                    <td className="p-2">
                                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])} className="p-1 border rounded-md bg-white">
                                            <option value="En attente">En attente</option>
                                            <option value="En traitement">En traitement</option>
                                            <option value="Expédiée">Expédiée</option>
                                            <option value="Livrée">Livrée</option>
                                        </select>
                                    </td>
                                    <td className="p-2 flex items-center space-x-2">
                                        <button onClick={() => setViewingOrder(order)} className="p-2 text-gray-600 hover:text-brand-primary" title="Voir les détails">
                                            <EyeIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(order)}
                                            disabled={generatingPdfFor === order.id}
                                            className="p-2 text-gray-600 hover:text-brand-primary disabled:opacity-50 disabled:cursor-wait"
                                            title="Télécharger la facture PDF"
                                        >
                                            {generatingPdfFor === order.id ? <SpinnerIcon /> : <PDFDownloadIcon />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            {viewingOrder && (
                <OrderDetailsModal 
                    order={viewingOrder} 
                    onClose={() => setViewingOrder(null)}
                    onDownloadPDF={handleDownloadPDF}
                    isDownloading={generatingPdfFor === viewingOrder.id}
                />
            )}
        </>
    );

    const renderSettings = () => (
        <div className="bg-brand-light p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Conditions Générales de Vente</h3>
            <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                rows={15}
                className="w-full p-2 border rounded-md font-mono bg-slate-50"
            />
            <button className="mt-4 px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-opacity-90">Enregistrer les CGV</button>
        </div>
    );
    
    const renderCategories = () => <CategoryManager />;

    const tabContent = {
        dashboard: renderDashboard(),
        products: renderProducts(),
        orders: renderOrders(),
        categories: renderCategories(),
        settings: renderSettings()
    };
    
    const tabNames: { [key in AdminTab]: string } = {
        dashboard: "Tableau de bord",
        products: "Produits",
        orders: "Commandes",
        categories: "Catégories",
        settings: "Paramètres"
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-center text-brand-dark">Admin WENDER STORES</h1>
                <button 
                    onClick={logout}
                    className="px-4 py-2 bg-brand-dark text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                >
                    Déconnexion
                </button>
            </div>
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                {(Object.keys(tabContent) as AdminTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize px-4 py-2 text-lg font-semibold transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`}
                    >
                        {tabNames[tab]}
                    </button>
                ))}
            </div>
            <div>
                {tabContent[activeTab]}
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { MOCK_PURCHASES } from '../services/mockData';
import { Purchase, PurchaseStatus } from '../types';
import { useUI } from '../context/UIContext';

// PurchaseModal Component
const PurchaseModal: React.FC<{
    purchase: Omit<Purchase, 'id' | 'status'> | Purchase | null;
    onClose: () => void;
    onSave: (purchase: Purchase) => void;
}> = ({ purchase, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Purchase, 'id' | 'status'>>(
        purchase || {
            supplier: '',
            itemsDescription: '',
            totalCost: 0,
            purchaseDate: new Date().toISOString(),
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPurchase: Purchase = {
            id: 'id' in (purchase || {}) ? (purchase as Purchase).id : Date.now().toString(),
            status: 'status' in (purchase || {}) ? (purchase as Purchase).status : PurchaseStatus.Pending,
            ...formData,
            purchaseDate: new Date(formData.purchaseDate).toISOString(),
        };
        onSave(newPurchase);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-lg border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">{purchase ? 'Modifier l\'achat' : 'Ajouter un achat'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Fournisseur" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <textarea name="itemsDescription" value={formData.itemsDescription} onChange={handleChange} placeholder="Description des articles (ex: 10kg de farine, 5L d'huile)" rows={3} className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <div className="flex space-x-4">
                        <input type="number" name="totalCost" value={formData.totalCost} onChange={handleChange} placeholder="Coût Total" className="w-1/2 bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" min="0" step="0.01" required />
                        <input type="date" name="purchaseDate" value={formData.purchaseDate.slice(0,10)} onChange={handleChange} className="w-1/2 bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Purchases Page Component
const Purchases: React.FC = () => {
    const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
    const { activeModal, openModal, closeModal, showToast } = useUI();

    const handleOpenModal = (purchase: Purchase | null = null) => {
        setEditingPurchase(purchase);
        openModal('purchase');
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingPurchase(null);
    };

    const handleSavePurchase = (purchase: Purchase) => {
        const isNew = !editingPurchase;
        if (isNew) {
            setPurchases(prev => [purchase, ...prev].sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
        } else {
            setPurchases(prev => prev.map(p => p.id === purchase.id ? purchase : p));
        }
        showToast({ message: `Achat ${isNew ? 'ajouté' : 'modifié'} avec succès`, type: 'success' });
    };

    const handleStatusChange = (id: string, status: PurchaseStatus) => {
        setPurchases(purchases.map(p => p.id === id ? { ...p, status } : p));
        showToast({ message: `Statut de l'achat mis à jour`, type: 'info' });
    };
    
    const getStatusClass = (status: PurchaseStatus) => {
        switch (status) {
            case PurchaseStatus.Pending: return 'bg-yellow-500/20 text-yellow-300';
            case PurchaseStatus.Completed: return 'bg-green-500/20 text-green-300';
            case PurchaseStatus.Cancelled: return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const isModalOpen = activeModal === 'purchase';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Gestion des Achats</h1>

            {isModalOpen && <PurchaseModal purchase={editingPurchase} onClose={handleCloseModal} onSave={handleSavePurchase} />}

            <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-bunker-800 text-sm text-bunker-400">
                                <th className="py-3 px-4">Fournisseur</th>
                                <th className="py-3 px-4">Articles</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Coût Total</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <tr key={purchase.id} className="border-b border-bunker-800/50 hover:bg-bunker-800/30">
                                    <td className="py-3 px-4 font-medium text-white">{purchase.supplier}</td>
                                    <td className="py-3 px-4 text-sm text-bunker-300 max-w-sm truncate" title={purchase.itemsDescription}>{purchase.itemsDescription}</td>
                                    <td className="py-3 px-4">{new Date(purchase.purchaseDate).toLocaleDateString('fr-FR')}</td>
                                    <td className="py-3 px-4 font-semibold">{purchase.totalCost.toFixed(2)}€</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(purchase.status)}`}>
                                            {purchase.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center space-x-4">
                                            <button onClick={() => handleOpenModal(purchase)} title="Modifier" className="text-bunker-300 hover:text-amber-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                             <button onClick={() => handleStatusChange(purchase.id, PurchaseStatus.Completed)} title="Marquer comme Terminé" className="text-green-400 hover:text-green-300 disabled:opacity-30 transition-colors" disabled={purchase.status === PurchaseStatus.Completed || purchase.status === PurchaseStatus.Cancelled}>✓</button>
                                             <button onClick={() => handleStatusChange(purchase.id, PurchaseStatus.Cancelled)} title="Annuler" className="text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors" disabled={purchase.status === PurchaseStatus.Completed || purchase.status === PurchaseStatus.Cancelled}>×</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Purchases;

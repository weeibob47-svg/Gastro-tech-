
import React, { useState, useMemo } from 'react';
import { MOCK_INVENTORY_ITEMS } from '../services/mockData';
import { InventoryItem, InventoryStatus, StockUnit } from '../types';
import { useUI } from '../context/UIContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryModal: React.FC<{
    item: Omit<InventoryItem, 'id'> | InventoryItem | null;
    onClose: () => void;
    onSave: (item: InventoryItem) => void;
}> = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<InventoryItem, 'id'> | InventoryItem>(item || { name: '', stock: 0, unit: StockUnit.Pieces, lowStockThreshold: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: InventoryItem = {
            id: 'id' in formData ? formData.id : Date.now().toString(),
            name: formData.name,
            stock: formData.stock,
            unit: formData.unit,
            lowStockThreshold: formData.lowStockThreshold,
        };
        onSave(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-md border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">{'id' in formData ? 'Modifier l\'article' : 'Ajouter un article'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom de l'article" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <div className="flex space-x-4">
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock initial" className="w-1/2 bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" min="0" step="any" required />
                        <select name="unit" value={formData.unit} onChange={handleChange} className="w-1/2 bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            {Object.values(StockUnit).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} placeholder="Seuil de stock bas" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" min="0" step="any" required />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RestockModal: React.FC<{
    item: InventoryItem;
    onClose: () => void;
    onSave: (itemId: string, quantity: number) => void;
}> = ({ item, onClose, onSave }) => {
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(quantity > 0) {
            onSave(item.id, quantity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-sm border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-2">Restocker: <span className="text-amber-500">{item.name}</span></h2>
                <p className="text-sm text-bunker-400 mb-6">Stock actuel: {item.stock} {item.unit}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="restock-quantity" className="block text-sm font-medium text-bunker-300 mb-2">Quantité à ajouter</label>
                        <input
                            type="number"
                            id="restock-quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                            min="1"
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Ajouter au Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


const Inventory: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(null);
    const { activeModal, openModal, closeModal, showToast } = useUI();

    const chartData = useMemo(() => inventory.map(item => ({
        name: item.name,
        'Stock Actuel': item.stock,
        'Seuil de stock bas': item.lowStockThreshold,
        unit: item.unit,
    })).sort((a, b) => a['Stock Actuel'] - b['Stock Actuel']), [inventory]);

    const getStatus = (item: InventoryItem): InventoryStatus => {
        if (item.stock <= 0) return InventoryStatus.OutOfStock;
        if (item.stock <= item.lowStockThreshold) return InventoryStatus.LowStock;
        return InventoryStatus.InStock;
    };

    const getStatusClass = (status: InventoryStatus) => {
        switch (status) {
            case InventoryStatus.InStock: return 'bg-green-500/20 text-green-300';
            case InventoryStatus.LowStock: return 'bg-yellow-500/20 text-yellow-300';
            case InventoryStatus.OutOfStock: return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    const handleOpenModal = (item: InventoryItem | null = null) => {
        setEditingItem(item);
        openModal('inventory');
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingItem(null);
    };
    
    const handleSaveItem = (item: InventoryItem) => {
        const isNew = !editingItem;
        if (isNew) {
            setInventory([...inventory, item]);
        } else {
            setInventory(inventory.map(i => i.id === item.id ? item : i));
        }
         showToast({ message: `Article ${isNew ? 'ajouté' : 'modifié'} avec succès`, type: 'success' });
    };

    const handleDeleteItem = (itemId: string) => {
        setInventory(prevInventory => prevInventory.filter(item => item.id !== itemId));
        showToast({ message: 'Article supprimé avec succès', type: 'success' });
    };

    const handleOpenRestockModal = (item: InventoryItem) => {
        setRestockingItem(item);
    };

    const handleCloseRestockModal = () => {
        setRestockingItem(null);
    };

    const handleRestock = (itemId: string, quantity: number) => {
        setInventory(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, stock: item.stock + quantity }
                    : item
            )
        );
        showToast({ message: 'Stock mis à jour avec succès', type: 'success' });
        handleCloseRestockModal();
    };

    const isModalOpen = activeModal === 'inventory';

    return (
        <div className="space-y-8">
            {isModalOpen && <InventoryModal item={editingItem} onClose={handleCloseModal} onSave={handleSaveItem} />}
            {restockingItem && <RestockModal item={restockingItem} onClose={handleCloseRestockModal} onSave={handleRestock} />}
            
            <h1 className="text-3xl font-bold text-white">Gestion de l'Inventaire</h1>
            
            <div className="bg-bunker-900 p-6 rounded-lg shadow-md border border-bunker-800">
                <h2 className="text-xl font-semibold text-white mb-4">Vue d'ensemble du Stock</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart 
                        data={chartData} 
                        margin={{ top: 5, right: 20, bottom: 80, left: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#393e55" />
                        <XAxis dataKey="name" stroke="#b1b8cf" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: '12px' }} />
                        <YAxis stroke="#b1b8cf" />
                        <Tooltip 
                            cursor={{ fill: 'rgba(110, 110, 110, 0.1)' }}
                            contentStyle={{ backgroundColor: '#11131a', border: '1px solid #393e55', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#e6e7ee' }}
                            formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unit}`, name]}
                        />
                        <Legend wrapperStyle={{ bottom: 10 }} />
                        <Bar dataKey="Stock Actuel" fill="#f59e0b" />
                        <Bar dataKey="Seuil de stock bas" fill="#656d95" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-bunker-800 text-sm text-bunker-400">
                                <th className="py-3 px-4">Article</th>
                                <th className="py-3 px-4">Stock Actuel</th>
                                <th className="py-3 px-4">Seuil Bas</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item: InventoryItem) => {
                                const status = getStatus(item);
                                return (
                                <tr key={item.id} className="border-b border-bunker-800/50 hover:bg-bunker-800/30">
                                    <td className="py-3 px-4 font-medium text-white">{item.name}</td>
                                    <td className="py-3 px-4">{item.stock.toLocaleString()} {item.unit}</td>
                                    <td className="py-3 px-4">{item.lowStockThreshold.toLocaleString()} {item.unit}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => handleOpenRestockModal(item)} title="Restocker" className="text-bunker-300 hover:text-green-500 transition-colors p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleOpenModal(item)} title="Modifier" className="text-bunker-300 hover:text-amber-500 transition-colors p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteItem(item.id)} title="Supprimer" className="text-bunker-300 hover:text-red-500 transition-colors p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
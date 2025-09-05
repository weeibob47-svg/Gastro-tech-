import React, { useState } from 'react';
import { MOCK_MENU_ITEMS } from '../services/mockData';
import { MenuItem, MenuItemCategory } from '../types';
import { generateMenuDescription } from '../services/geminiService';
import { useUI } from '../context/UIContext';

const MenuItemCard: React.FC<{ item: MenuItem, onEdit: (item: MenuItem) => void }> = ({ item, onEdit }) => (
    <div className="bg-bunker-900 rounded-lg overflow-hidden shadow-lg border border-bunker-800 flex flex-col">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <span className="text-lg font-semibold text-amber-500">{item.price.toFixed(2)}€</span>
            </div>
            <p className="text-sm text-bunker-400 mt-2 flex-grow">{item.description}</p>
            <div className="mt-4 flex justify-between items-center">
                 <span className="text-xs font-medium bg-bunker-800 text-amber-400 px-2 py-1 rounded">{item.category}</span>
                 <button onClick={() => onEdit(item)} className="text-sm text-bunker-300 hover:text-white transition-colors">
                     Modifier
                 </button>
            </div>
        </div>
    </div>
);

const AiDescSpinner: React.FC = () => (
    <div className="border-2 border-bunker-700 border-t-amber-500 rounded-full w-4 h-4 animate-spin"></div>
);

const MenuModal: React.FC<{ item: MenuItem | null, onClose: () => void, onSave: (item: MenuItem) => void }> = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState<MenuItem>(item || { id: '', name: '', description: '', price: 0, category: MenuItemCategory.PlatPrincipal, imageUrl: 'https://picsum.photos/400/300' });
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) return;
        setIsGeneratingDesc(true);
        try {
            const description = await generateMenuDescription(formData.name);
            setFormData(prev => ({...prev, description }));
        } catch (error) {
            console.error("Failed to generate description", error);
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: item?.id || Date.now().toString() });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-lg border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">{item?.id ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom du plat" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label htmlFor="description" className="block text-sm font-medium text-bunker-300">Description</label>
                             <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={!formData.name || isGeneratingDesc}
                                className="flex items-center space-x-1.5 text-xs text-amber-500 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Générer une description avec l'IA"
                             >
                                {isGeneratingDesc ? <AiDescSpinner/> : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.256 9a1 1 0 010 1.998l-3.11 1.799-1.179 4.455a1 1 0 01-1.933 0L9.854 12.8 6.744 11a1 1 0 010-1.998l3.11-1.799L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className={isGeneratingDesc ? 'animate-pulse' : ''}>{isGeneratingDesc ? 'Génération...' : 'Générer'}</span>
                             </button>
                        </div>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} required />
                    </div>
                    
                    <div className="flex space-x-4">
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Prix" className="w-1/2 bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" step="0.01" min="0" required />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-1/2 bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            {Object.values(MenuItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de l'image" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Menu: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { activeModal, openModal, closeModal, showToast } = useUI();

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        openModal('menu');
    };
    
    const handleCloseModal = () => {
        closeModal();
        setEditingItem(null);
    };

    const handleSave = (itemToSave: MenuItem) => {
        const isNew = !editingItem;
        if (isNew) {
            setMenuItems([...menuItems, itemToSave]);
        } else {
            setMenuItems(menuItems.map(item => item.id === itemToSave.id ? itemToSave : item));
        }
        showToast({ message: `Plat ${isNew ? 'ajouté' : 'modifié'} avec succès`, type: 'success' });
    };
    
    const categories = Object.values(MenuItemCategory);
    const isModalOpen = activeModal === 'menu';

    return (
        <div>
            {isModalOpen && <MenuModal item={editingItem} onClose={handleCloseModal} onSave={handleSave} />}
            
            <div className="space-y-10">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="text-2xl font-semibold text-amber-500 border-b-2 border-bunker-800 pb-2 mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {menuItems.filter(item => item.category === category).map(item => (
                                <MenuItemCard key={item.id} item={item} onEdit={handleEdit} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
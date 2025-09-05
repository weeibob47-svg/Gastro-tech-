import React, { useState, useMemo } from 'react';
import { MOCK_ORDERS, MOCK_TABLES, MOCK_MENU_ITEMS } from '../services/mockData';
import { Order, OrderStatus, OrderItem, MenuItem } from '../types';
import { useUI } from '../context/UIContext';

const OrderModal: React.FC<{ onClose: () => void, onSave: (order: Order) => void }> = ({ onClose, onSave }) => {
    interface OrderFormData {
        tableNumber: number | null;
        items: OrderItem[];
    }
    const [formData, setFormData] = useState<OrderFormData>({ tableNumber: null, items: [] });
    const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>(MOCK_MENU_ITEMS[0]?.id || '');
    const [quantity, setQuantity] = useState(1);

    const total = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [formData.items]);

    const handleAddItem = () => {
        if (!selectedMenuItemId || quantity <= 0) return;
        
        const menuItem = MOCK_MENU_ITEMS.find(item => item.id === selectedMenuItemId);
        if (!menuItem) return;

        setFormData(prev => {
            const existingItem = prev.items.find(item => item.id === selectedMenuItemId);
            if (existingItem) {
                const updatedItems = prev.items.map(item => 
                    item.id === selectedMenuItemId ? { ...item, quantity: item.quantity + quantity } : item
                );
                return { ...prev, items: updatedItems };
            } else {
                const newItem: OrderItem = {
                    id: menuItem.id,
                    name: menuItem.name,
                    quantity,
                    price: menuItem.price
                };
                return { ...prev, items: [...prev.items, newItem]};
            }
        });

        setQuantity(1);
    };

    const handleRemoveItem = (itemId: string) => {
        setFormData(prev => ({...prev, items: prev.items.filter(item => item.id !== itemId)}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tableNumber || formData.items.length === 0) {
            // Can add a toast message for error
            return;
        }

        const newOrder: Order = {
            id: `ORD${Date.now()}`,
            tableNumber: formData.tableNumber,
            items: formData.items,
            total: total,
            status: OrderStatus.New,
            timestamp: new Date().toISOString()
        };
        onSave(newOrder);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-lg border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">Créer une nouvelle commande</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="tableNumber" className="block text-sm font-medium text-bunker-300 mb-2">Table</label>
                        <select
                            id="tableNumber"
                            name="tableNumber"
                            value={formData.tableNumber || ''}
                            onChange={(e) => setFormData(p => ({...p, tableNumber: parseInt(e.target.value)}))}
                            className="w-full bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        >
                            <option value="" disabled>Sélectionner une table</option>
                            {MOCK_TABLES.map(table => <option key={table.id} value={table.id}>{table.id} - {table.capacity} places</option>)}
                        </select>
                    </div>

                    <div className="border-t border-bunker-800 pt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Articles</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 mb-4">
                            {formData.items.length === 0 ? (
                                <p className="text-bunker-400 text-sm">Aucun article ajouté.</p>
                            ) : (
                                formData.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-bunker-800/50 p-2 rounded">
                                        <div>
                                            <span className="text-white">{item.quantity}x {item.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-bunker-300">{(item.quantity * item.price).toFixed(2)}€</span>
                                            <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300 text-lg">&times;</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex space-x-2 items-end bg-bunker-800/50 p-3 rounded-b">
                           <div className="flex-grow">
                                <label htmlFor="menuItem" className="block text-xs font-medium text-bunker-400 mb-1">Article</label>
                                <select id="menuItem" value={selectedMenuItemId} onChange={e => setSelectedMenuItemId(e.target.value)} className="w-full bg-bunker-700 p-2 rounded text-white border border-bunker-600 text-sm">
                                    {MOCK_MENU_ITEMS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                           </div>
                           <div>
                                <label htmlFor="quantity" className="block text-xs font-medium text-bunker-400 mb-1">Quantité</label>
                                <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" className="w-20 bg-bunker-700 p-2 rounded text-white border border-bunker-600 text-sm" />
                           </div>
                           <button type="button" onClick={handleAddItem} className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors self-end text-sm">Ajouter</button>
                        </div>
                    </div>

                    <div className="text-right text-xl font-bold text-white pt-2">
                        Total: {total.toFixed(2)}€
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                        <button type="submit" disabled={!formData.tableNumber || formData.items.length === 0} className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Créer la commande
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ order, onStatusChange }) => {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.New: return 'border-l-blue-500';
            case OrderStatus.InProgress: return 'border-l-yellow-500';
            case OrderStatus.Completed: return 'border-l-green-500';
            case OrderStatus.Paid: return 'border-l-purple-500';
            default: return 'border-l-gray-500';
        }
    };
    
    const nextStatus = (current: OrderStatus): OrderStatus | null => {
        const statuses = [OrderStatus.New, OrderStatus.InProgress, OrderStatus.Completed, OrderStatus.Paid];
        const currentIndex = statuses.indexOf(current);
        return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null;
    };
    
    const handleNextStatus = () => {
        const nxt = nextStatus(order.status);
        if (nxt) {
            onStatusChange(order.id, nxt);
        }
    };
    
    return (
        <div className={`bg-bunker-900 rounded-lg p-4 mb-4 border-l-4 ${getStatusColor(order.status)} shadow-lg`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-white">Table {order.tableNumber}</h3>
                <span className="text-sm font-mono text-amber-500">#{order.id.slice(0, 6)}</span>
            </div>
            <p className="text-xs text-bunker-400 mb-3">{new Date(order.timestamp).toLocaleString('fr-FR')}</p>
            <div className="space-y-1 mb-3">
                {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-bunker-300">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.quantity * item.price).toFixed(2)}€</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-bunker-800 pt-2 flex justify-between items-center">
                <span className="font-semibold text-white">Total: {order.total.toFixed(2)}€</span>
                {nextStatus(order.status) && (
                    <button onClick={handleNextStatus} className="bg-amber-600 text-white px-3 py-1 text-sm rounded-md hover:bg-amber-500 transition-colors">
                        Suivant &rarr;
                    </button>
                )}
            </div>
        </div>
    );
};


const OrdersColumn: React.FC<{ title: string, orders: Order[], onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ title, orders, onStatusChange }) => (
    <div className="bg-bunker-950/50 rounded-lg p-4 w-full md:w-1/4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">{title} ({orders.length})</h2>
        <div className="space-y-4 h-[75vh] overflow-y-auto pr-2">
            {orders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
            ))}
        </div>
    </div>
);

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const { activeModal, closeModal, showToast } = useUI();
    const isModalOpen = activeModal === 'order';

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const handleSaveOrder = (newOrder: Order) => {
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        showToast({ message: 'Commande créée avec succès', type: 'success' });
    };

    const filterOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status)
            .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    return (
        <div className="h-full flex flex-col">
             {isModalOpen && <OrderModal onClose={closeModal} onSave={handleSaveOrder} />}
            <h1 className="text-3xl font-bold text-white mb-6">Gestion des Commandes</h1>
            <div className="flex-grow flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <OrdersColumn title="Nouveau" orders={filterOrdersByStatus(OrderStatus.New)} onStatusChange={handleStatusChange} />
                <OrdersColumn title="En Préparation" orders={filterOrdersByStatus(OrderStatus.InProgress)} onStatusChange={handleStatusChange} />
                <OrdersColumn title="Terminé" orders={filterOrdersByStatus(OrderStatus.Completed)} onStatusChange={handleStatusChange} />
                <OrdersColumn title="Payé" orders={filterOrdersByStatus(OrderStatus.Paid)} onStatusChange={handleStatusChange} />
            </div>
        </div>
    );
};

export default Orders;
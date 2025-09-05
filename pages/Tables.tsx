
import React, { useState } from 'react';
import { MOCK_TABLES, MOCK_RESERVATIONS } from '../services/mockData';
import { Table, TableStatus, Reservation, ReservationStatus } from '../types';
import { useUI } from '../context/UIContext';

const TableEditModal: React.FC<{
    table: Table;
    onClose: () => void;
    onSave: (table: Table) => void;
}> = ({ table, onClose, onSave }) => {
    const [capacity, setCapacity] = useState(table.capacity);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...table, capacity });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-bunker-900 rounded-lg p-8 w-full max-w-sm border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">Modifier la Table {table.id}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-bunker-300 mb-2">Capacité (nombre de places)</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                            min="1"
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-bunker-800">
                    <button type="button" onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Annuler</button>
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Sauvegarder</button>
                </div>
            </form>
        </div>
    );
};


const TableCard: React.FC<{ table: Table, reservation?: Reservation, onClick: (table: Table) => void, onEdit: (table: Table) => void }> = ({ table, reservation, onClick, onEdit }) => {
    const getStatusClasses = (status: TableStatus) => {
        switch (status) {
            case TableStatus.Available:
                return 'bg-green-500/20 border-green-500 text-green-300 hover:bg-green-500/30';
            case TableStatus.Occupied:
                return 'bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30';
            case TableStatus.Reserved:
                return 'bg-yellow-500/20 border-yellow-500 text-yellow-300 hover:bg-yellow-500/30';
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(table);
    };

    return (
        <div 
            onClick={() => onClick(table)}
            className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center aspect-square shadow-lg ${getStatusClasses(table.status)}`}
        >
             <button onClick={handleEditClick} title="Modifier la table" className="absolute top-2 right-2 text-bunker-400 hover:text-white transition-colors p-1 rounded-full hover:bg-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
            </button>
            <span className="text-4xl font-bold text-white">{table.id}</span>
            <span className="mt-2 font-semibold">{table.status}</span>
            <span className="text-xs text-bunker-400">{table.capacity} places</span>
            {reservation && (
                <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="mt-1 text-xs bg-black/30 px-2 py-1 rounded text-amber-400 truncate font-medium">{reservation.customerName}</span>
                </div>
            )}
        </div>
    );
};

const TableModal: React.FC<{ table: Table | null, reservations: Reservation[], onClose: () => void, onSave: (tableId: number, newStatus: TableStatus, reservationId?: string) => void }> = ({ table, reservations, onClose, onSave }) => {
    if (!table) return null;

    const [selectedReservationId, setSelectedReservationId] = useState(table.reservationId || '');

    const availableReservations = reservations.filter(r => r.status === ReservationStatus.Confirmed && (!r.tableId || r.tableId === table.id));
    const associatedReservation = reservations.find(r => r.id === table.reservationId);
    
    const handleSaveStatus = (newStatus: TableStatus) => {
        let finalReservationId = (newStatus === TableStatus.Reserved || newStatus === TableStatus.Occupied) ? selectedReservationId : undefined;
        if (newStatus === TableStatus.Occupied && table.status === TableStatus.Reserved && table.reservationId) {
            finalReservationId = table.reservationId;
        }
        onSave(table.id, newStatus, finalReservationId);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-md border border-bunker-700 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Table {table.id}</h2>
                     <button onClick={onClose} className="text-bunker-400 hover:text-white text-2xl">&times;</button>
                </div>
                <p className="text-bunker-400 mt-2">Capacité: {table.capacity} personnes</p>
                
                {associatedReservation && (
                    <div className="mt-4 border-t border-bunker-800 pt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Réservation Associée</h3>
                        <p className="text-bunker-300">Client: <span className="font-semibold text-bunker-100">{associatedReservation.customerName}</span></p>
                        <p className="text-bunker-300">Heure: <span className="font-semibold text-bunker-100">{new Date(associatedReservation.reservationTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span></p>
                    </div>
                )}
                {table.orderId && (
                     <div className="mt-4 border-t border-bunker-800 pt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Commande associée</h3>
                        <p className="text-bunker-300">Commande <span className="font-mono text-amber-500">#{table.orderId?.slice(0,6)}</span></p>
                     </div>
                )}
                
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Changer le statut</h3>

                    {(table.status === TableStatus.Available || table.status === TableStatus.Reserved) && (
                        <div className="mb-4">
                            <label htmlFor="reservation-select" className="block text-sm font-medium text-bunker-300 mb-2">Associer une réservation</label>
                            <select
                                id="reservation-select"
                                value={selectedReservationId}
                                onChange={e => setSelectedReservationId(e.target.value)}
                                className="w-full bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="">Aucune</option>
                                {availableReservations.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.customerName} ({r.guestCount}p) - {new Date(r.reservationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        {Object.values(TableStatus).map(status => (
                            <button
                                key={status}
                                onClick={() => handleSaveStatus(status)}
                                disabled={table.status === status || (status === TableStatus.Reserved && table.status === TableStatus.Available && !selectedReservationId)}
                                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                    ${status === TableStatus.Available ? 'bg-green-600 hover:bg-green-500' : ''}
                                    ${status === TableStatus.Occupied ? 'bg-red-600 hover:bg-red-500' : ''}
                                    ${status === TableStatus.Reserved ? 'bg-yellow-600 hover:bg-yellow-500' : ''}
                                `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="mt-8 text-right">
                    <button onClick={onClose} className="bg-bunker-700 text-white px-4 py-2 rounded-md hover:bg-bunker-600 transition-colors">Fermer</button>
                 </div>
            </div>
        </div>
    );
};

const Tables: React.FC = () => {
    const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const { showToast } = useUI();

    const handleTableClick = (table: Table) => setSelectedTable(table);
    const handleCloseModal = () => setSelectedTable(null);

    const handleEditClick = (table: Table) => setEditingTable(table);
    const handleCloseEditModal = () => setEditingTable(null);
    
    const handleSave = (tableId: number, newStatus: TableStatus, reservationId?: string) => {
        const previousTableState = tables.find(t => t.id === tableId);

        setTables(prevTables => prevTables.map(table =>
            table.id === tableId 
            ? { ...table, status: newStatus, reservationId: reservationId, orderId: newStatus === TableStatus.Available ? undefined : table.orderId } 
            : table
        ));
        
        setReservations(prevReservations => {
            return prevReservations.map(res => {
                if (res.id === reservationId) {
                    return { ...res, tableId: tableId };
                }
                if (res.id === previousTableState?.reservationId && res.id !== reservationId) {
                    return { ...res, tableId: undefined };
                }
                return res;
            });
        });
        showToast({message: `Statut de la table ${tableId} mis à jour.`, type: 'info'});
    };

    const handleSaveEditedTable = (editedTable: Table) => {
        setTables(prev => prev.map(t => t.id === editedTable.id ? editedTable : t));
        showToast({ message: `Table ${editedTable.id} modifiée avec succès.`, type: 'success' });
        handleCloseEditModal();
    };

    return (
        <div>
            {selectedTable && <TableModal table={selectedTable} reservations={reservations} onClose={handleCloseModal} onSave={handleSave} />}
            {editingTable && <TableEditModal table={editingTable} onClose={handleCloseEditModal} onSave={handleSaveEditedTable} />}

            <h1 className="text-3xl font-bold text-white mb-6">Plan de Salle</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {tables.map(table => {
                    const reservation = reservations.find(r => r.id === table.reservationId);
                    return (
                        <TableCard key={table.id} table={table} reservation={reservation} onClick={handleTableClick} onEdit={handleEditClick} />
                    )
                })}
            </div>
        </div>
    );
};

export default Tables;
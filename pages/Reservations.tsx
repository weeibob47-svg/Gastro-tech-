
import React, { useState } from 'react';
import { MOCK_RESERVATIONS } from '../services/mockData';
import { Reservation, ReservationStatus } from '../types';
import { useUI } from '../context/UIContext';

const ReservationModal: React.FC<{
    reservation: Reservation | null;
    onClose: () => void;
    onSave: (reservation: Reservation) => void;
}> = ({ reservation, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Reservation, 'id' | 'status'>>({
        customerName: '',
        phoneNumber: '',
        guestCount: 2,
        reservationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        ...reservation
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReservation: Reservation = {
            id: reservation?.id || Date.now().toString(),
            status: reservation?.status || ReservationStatus.Confirmed,
            ...formData
        };
        onSave(newReservation);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-md border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">{reservation ? 'Modifier la réservation' : 'Ajouter une réservation'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Nom du client" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Numéro de téléphone" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <div className="flex space-x-4">
                        <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} placeholder="Nombre de convives" className="w-1/2 bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" min="1" required />
                        <input type="datetime-local" name="reservationTime" value={new Date(formData.reservationTime).toISOString().slice(0,16)} onChange={handleChange} className="w-1/2 bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
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


const Reservations: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS.sort((a,b) => new Date(a.reservationTime).getTime() - new Date(b.reservationTime).getTime()));
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const { activeModal, openModal, closeModal, showToast } = useUI();

    const handleOpenModal = (reservation: Reservation | null = null) => {
        setEditingReservation(reservation);
        openModal('reservation');
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingReservation(null);
    };

    const handleSaveReservation = (reservation: Reservation) => {
        const isNew = !editingReservation;
        if (isNew) {
            setReservations([...reservations, reservation].sort((a,b) => new Date(a.reservationTime).getTime() - new Date(b.reservationTime).getTime()));
        } else {
            setReservations(reservations.map(r => r.id === reservation.id ? reservation : r));
        }
        showToast({ message: `Réservation ${isNew ? 'ajoutée' : 'modifiée'} avec succès`, type: 'success' });
    };
    
    const handleStatusChange = (id: string, status: ReservationStatus) => {
        setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
        showToast({ message: `Statut de la réservation mis à jour`, type: 'info' });
    };

    const getStatusClass = (status: ReservationStatus) => {
        switch (status) {
            case ReservationStatus.Confirmed: return 'bg-blue-500/20 text-blue-300';
            case ReservationStatus.Arrived: return 'bg-green-500/20 text-green-300';
            case ReservationStatus.Cancelled: return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    const isModalOpen = activeModal === 'reservation';

    return (
        <div className="space-y-8">
            {isModalOpen && <ReservationModal reservation={editingReservation} onClose={handleCloseModal} onSave={handleSaveReservation} />}

            <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-bunker-800 text-sm text-bunker-400">
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Date et Heure</th>
                                <th className="py-3 px-4">Convives</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res: Reservation) => (
                                <tr key={res.id} className="border-b border-bunker-800/50 hover:bg-bunker-800/30">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-white">{res.customerName}</div>
                                        <div className="text-xs text-bunker-400">{res.phoneNumber}</div>
                                    </td>
                                    <td className="py-3 px-4">{new Date(res.reservationTime).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td className="py-3 px-4 text-center">{res.guestCount}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center space-x-2">
                                             <button onClick={() => handleStatusChange(res.id, ReservationStatus.Arrived)} title="Marquer comme arrivé" className="text-green-400 hover:text-green-300 disabled:opacity-30 transition-colors" disabled={res.status === ReservationStatus.Arrived || res.status === ReservationStatus.Cancelled}>✓</button>
                                             <button onClick={() => handleOpenModal(res)} title="Modifier" className="text-bunker-300 hover:text-amber-500 transition-colors">✎</button>
                                             <button onClick={() => handleStatusChange(res.id, ReservationStatus.Cancelled)} title="Annuler" className="text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors" disabled={res.status === ReservationStatus.Arrived || res.status === ReservationStatus.Cancelled}>×</button>
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

export default Reservations;

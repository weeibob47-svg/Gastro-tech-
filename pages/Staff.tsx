
import React, { useState } from 'react';
import { MOCK_STAFF_MEMBERS } from '../services/mockData';
import { StaffMember, StaffStatus, StaffRole } from '../types';
import { useUI } from '../context/UIContext';

const StaffModal: React.FC<{
    member: StaffMember | null;
    onClose: () => void;
    onSave: (member: StaffMember) => void;
}> = ({ member, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<StaffMember, 'id' | 'status'>>({
        name: '',
        role: StaffRole.Serveur,
        hourlyRate: 15.00,
        ...member
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMember: StaffMember = {
            id: member?.id || Date.now().toString(),
            status: member?.status || StaffStatus.Actif,
            ...formData
        };
        onSave(newMember);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-bunker-900 rounded-lg p-8 w-full max-w-md border border-bunker-700 shadow-2xl animate-fade-in-up">
                <h2 className="text-2xl font-bold text-white mb-6">{member ? 'Modifier le membre' : 'Ajouter un membre'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet" className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                    <div className="flex space-x-4">
                        <select name="role" value={formData.role} onChange={handleChange} className="w-1/2 bg-bunker-800 p-2 rounded text-white border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} placeholder="Taux horaire" className="w-1/2 bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500" min="0" step="0.01" required />
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

const Staff: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF_MEMBERS);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
    const { activeModal, openModal, closeModal, showToast } = useUI();

    const handleOpenModal = (member: StaffMember | null = null) => {
        setEditingMember(member);
        openModal('staff');
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingMember(null);
    };

    const handleSaveMember = (member: StaffMember) => {
        const isNew = !editingMember;
        if (isNew) {
            setStaff([...staff, member]);
        } else {
            setStaff(staff.map(m => m.id === member.id ? member : m));
        }
        showToast({ message: `Membre ${isNew ? 'ajouté' : 'modifié'} avec succès`, type: 'success' });
    };

    const handleStatusToggle = (id: string) => {
        setStaff(staff.map(m => m.id === id ? { ...m, status: m.status === StaffStatus.Actif ? StaffStatus.Inactif : StaffStatus.Actif } : m));
        showToast({ message: 'Statut du membre mis à jour', type: 'info' });
    };

    const getStatusClass = (status: StaffStatus) => {
        return status === StaffStatus.Actif ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';
    };

    const isModalOpen = activeModal === 'staff';

    return (
        <div className="space-y-8">
            {isModalOpen && <StaffModal member={editingMember} onClose={handleCloseModal} onSave={handleSaveMember} />}
            <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-bunker-800 text-sm text-bunker-400">
                                <th className="py-3 px-4">Nom</th>
                                <th className="py-3 px-4">Rôle</th>
                                <th className="py-3 px-4">Taux Horaire</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id} className="border-b border-bunker-800/50 hover:bg-bunker-800/30">
                                    <td className="py-3 px-4 font-medium text-white">{member.name}</td>
                                    <td className="py-3 px-4">{member.role}</td>
                                    <td className="py-3 px-4">{member.hourlyRate.toFixed(2)}€ / h</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(member.status)}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center space-x-4">
                                            <button onClick={() => handleOpenModal(member)} title="Modifier" className="text-bunker-300 hover:text-amber-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <label htmlFor={`toggle-${member.id}`} className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                <input type="checkbox" id={`toggle-${member.id}`} className="sr-only" checked={member.status === StaffStatus.Actif} onChange={() => handleStatusToggle(member.id)} />
                                                <div className="block bg-bunker-700 w-10 h-6 rounded-full"></div>
                                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                                                </div>
                                            </label>
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

export default Staff;

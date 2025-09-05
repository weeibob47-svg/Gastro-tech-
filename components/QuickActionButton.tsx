
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const QuickActionButton: React.FC = () => {
    const location = useLocation();
    const { openModal } = useUI();

    let action: (() => void) | null = null;
    let title: string | null = null;

    if (location.pathname === '/menu') {
        action = () => openModal('menu');
        title = 'Ajouter un plat';
    } else if (location.pathname === '/reservations') {
        action = () => openModal('reservation');
        title = 'Ajouter une réservation';
    } else if (location.pathname === '/inventory') {
        action = () => openModal('inventory');
        title = 'Ajouter un article';
    } else if (location.pathname === '/purchases') {
        action = () => openModal('purchase');
        title = 'Ajouter un achat';
    } else if (location.pathname === '/staff') {
        action = () => openModal('staff');
        title = 'Ajouter un membre';
    } else if (location.pathname === '/orders') {
        action = () => openModal('order');
        title = 'Créer une commande';
    }


    if (!action) {
        return null;
    }

    return (
        <button
            onClick={action}
            title={title || ''}
            aria-label={title || ''}
            className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200 ease-in-out z-40"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
};

export default QuickActionButton;
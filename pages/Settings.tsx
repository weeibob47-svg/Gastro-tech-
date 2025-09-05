
import React, { useState } from 'react';
import { useUI } from '../context/UIContext';

const Settings: React.FC = () => {
    const { showToast } = useUI();
    const [settings, setSettings] = useState({
        restaurantName: 'GastroTech Pro',
        address: '123 Rue de la Gastronomie, 75001 Paris',
        phone: '01 23 45 67 89',
        darkMode: true,
        orderNotifications: true,
        reservationNotifications: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        showToast({ message: 'Paramètres sauvegardés avec succès', type: 'success' });
    };

    const SettingRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
            <label className="text-sm font-medium text-bunker-300">{label}</label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                {children}
            </div>
        </div>
    );

    const TextInput: React.FC<{name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ name, value, onChange }) => (
         <input 
            type="text" 
            name={name} 
            id={name} 
            value={value} 
            onChange={onChange}
            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
    );
     const Toggle: React.FC<{name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ name, checked, onChange }) => (
        <label htmlFor={name} className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id={name} name={name} className="sr-only" checked={checked} onChange={onChange} />
                <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-amber-500' : 'bg-bunker-700'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
            </div>
        </label>
    );

    return (
        <div className="max-w-3xl mx-auto">
             <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>
             <form onSubmit={handleSave}>
                <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800">
                    <div className="p-6 border-b border-bunker-800">
                        <h2 className="text-xl font-semibold text-white">Informations du Restaurant</h2>
                        <p className="mt-1 text-sm text-bunker-400">Gérez les informations publiques de votre établissement.</p>
                    </div>
                    <div className="p-6 divide-y divide-bunker-800">
                        <SettingRow label="Nom du restaurant">
                           <TextInput name="restaurantName" value={settings.restaurantName} onChange={handleChange} />
                        </SettingRow>
                        <SettingRow label="Adresse">
                            <TextInput name="address" value={settings.address} onChange={handleChange} />
                        </SettingRow>
                        <SettingRow label="Téléphone">
                             <TextInput name="phone" value={settings.phone} onChange={handleChange} />
                        </SettingRow>
                    </div>
                </div>

                <div className="bg-bunker-900 rounded-lg shadow-md border border-bunker-800 mt-8">
                    <div className="p-6 border-b border-bunker-800">
                        <h2 className="text-xl font-semibold text-white">Notifications</h2>
                         <p className="mt-1 text-sm text-bunker-400">Choisissez comment vous souhaitez être notifié.</p>
                    </div>
                    <div className="p-6 divide-y divide-bunker-800">
                        <SettingRow label="Notifications de commande">
                            <Toggle name="orderNotifications" checked={settings.orderNotifications} onChange={handleChange} />
                        </SettingRow>
                         <SettingRow label="Notifications de réservation">
                            <Toggle name="reservationNotifications" checked={settings.reservationNotifications} onChange={handleChange} />
                        </SettingRow>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-500 transition-colors">
                        Sauvegarder les changements
                    </button>
                </div>
             </form>
        </div>
    );
};

export default Settings;

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useUI } from '../context/UIContext';

const UserProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const itemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    // Close on click outside or escape key
    useEffect(() => {
        const handleInteractionOutside = (event: MouseEvent | KeyboardEvent) => {
            if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') {
                return;
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleInteractionOutside);
        document.addEventListener('keydown', handleInteractionOutside);

        return () => {
            document.removeEventListener('mousedown', handleInteractionOutside);
            document.removeEventListener('keydown', handleInteractionOutside);
        };
    }, [isOpen]);

    // Focus management
    useEffect(() => {
        if (isOpen) {
            itemsRef.current[0]?.focus();
        } else {
            // Delay returning focus to prevent re-opening on spacebar press
            setTimeout(() => buttonRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen) return;

        // Fix: Check for `disabled` property safely on HTMLButtonElement.
        const items = itemsRef.current.filter(item => {
            if (!item) return false;
            if (item instanceof HTMLButtonElement) {
                return !item.disabled;
            }
            return true;
        }) as (HTMLAnchorElement | HTMLButtonElement)[];
        const activeIndex = items.findIndex(item => item === document.activeElement);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = (activeIndex + 1) % items.length;
                items[nextIndex]?.focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = (activeIndex - 1 + items.length) % items.length;
                items[prevIndex]?.focus();
                break;
            case 'Home':
                event.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                id="user-menu-button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls="user-menu"
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-bunker-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bunker-900 focus:ring-amber-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>
            <div
                id="user-menu"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                onKeyDown={handleKeyDown}
                className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-bunker-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-150 ease-out transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="px-4 py-3 border-b border-bunker-700">
                    <p className="text-sm font-medium text-white truncate">Jean Dupont</p>
                    <p className="text-xs text-bunker-400 truncate">Manager</p>
                </div>
                <div className="py-1">
                    <Link 
                        to="/settings" 
                        role="menuitem"
                        // Fix: Ensure ref callback returns void.
                        ref={el => { itemsRef.current[0] = el; }}
                        tabIndex={-1}
                        onClick={() => setIsOpen(false)} 
                        className="group flex items-center px-4 py-2 text-sm text-bunker-200 hover:bg-bunker-700 focus:bg-bunker-700 focus:outline-none w-full text-left transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-bunker-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Paramètres
                    </Link>
                    <button 
                        onClick={(e) => { e.preventDefault(); setIsOpen(false); }} 
                        role="menuitem"
                        // Fix: Ensure ref callback returns void.
                        ref={el => { itemsRef.current[1] = el; }}
                        tabIndex={-1}
                        className="group flex items-center px-4 py-2 text-sm text-bunker-200 hover:bg-bunker-700 focus:bg-bunker-700 focus:outline-none w-full text-left transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-bunker-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
};


const Header: React.FC = () => {
    const location = useLocation();
    const { toggleSidebar } = useUI();
    const currentLink = NAV_LINKS.find(link => link.path === location.pathname);
    const title = currentLink ? currentLink.name : '';

    return (
        <header className="bg-bunker-900/80 backdrop-blur-sm border-b border-bunker-800 p-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-4">
                 <button onClick={toggleSidebar} className="text-bunker-300 hover:text-white" aria-label="Toggle sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white hidden sm:block">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Recherche rapide..."
                        className="w-64 bg-bunker-800 py-2 pl-10 pr-4 rounded-lg text-white placeholder-bunker-400 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bunker-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <UserProfileDropdown />
            </div>
        </header>
    );
};

export default Header;
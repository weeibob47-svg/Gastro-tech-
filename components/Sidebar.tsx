
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useUI } from '../context/UIContext';

const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useUI();

  return (
    <aside className={`bg-bunker-900/50 border-r border-bunker-800 flex flex-col p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className={`flex items-center mb-10 h-6 transition-all duration-300 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
        <span className="text-2xl font-bold text-amber-500 font-serif tracking-wider whitespace-nowrap">
          {isSidebarOpen ? 'GastroTech' : 'G'}
        </span>
      </div>
      <nav className="flex flex-col space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            title={isSidebarOpen ? '' : link.name}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${isSidebarOpen ? '' : 'justify-center'} ${
                isActive
                  ? 'bg-amber-500 text-bunker-950 shadow-lg'
                  : 'text-bunker-300 hover:bg-bunker-800/50 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className={`font-medium whitespace-nowrap transition-all duration-200 ease-in-out ${isSidebarOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0'}`}>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className={`mt-auto text-center text-xs text-bunker-500 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
        <p>GastroTech Pro &copy; 2024</p>
        <p>Tous droits réservés.</p>
      </div>
    </aside>
  );
};

export default Sidebar;


import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import AIAssistant from './pages/AIAssistant';
import Inventory from './pages/Inventory';
import Header from './components/Header';
import { UIProvider } from './context/UIContext';
import ToastProvider from './components/ToastProvider';
import QuickActionButton from './components/QuickActionButton';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Purchases from './pages/Purchases';

const App: React.FC = () => {
  return (
    <HashRouter>
      <UIProvider>
        <div className="flex h-screen bg-bunker-950 font-sans">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
          <QuickActionButton />
          <ToastProvider />
        </div>
      </UIProvider>
    </HashRouter>
  );
};

export default App;
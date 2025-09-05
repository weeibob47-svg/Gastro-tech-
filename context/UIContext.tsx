
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type ModalType = 'menu' | 'reservation' | 'inventory' | 'staff' | 'order' | 'purchase' | null;

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: number) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar, activeModal, openModal, closeModal, toasts, showToast, removeToast }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
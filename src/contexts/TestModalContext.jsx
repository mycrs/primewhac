import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TestModalContext = createContext();

export const TestModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Sayfa değişince veya admin sayfalarına geçince modalı kapat
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Expose both names to maintain compatibility while satisfying the prompt
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Alias for clarity as requested
  const openTestModal = openModal;
  const closeTestModal = closeModal;

  return (
    <TestModalContext.Provider value={{ isOpen, openModal, closeModal, openTestModal, closeTestModal }}>
      {children}
    </TestModalContext.Provider>
  );
};

export const useTestModal = () => {
  const context = useContext(TestModalContext);
  if (!context) {
    throw new Error('useTestModal must be used within a TestModalProvider');
  }
  return context;
};
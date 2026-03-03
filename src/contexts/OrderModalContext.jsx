import React, { createContext, useContext, useState } from 'react';

const OrderModalContext = createContext();

export const OrderModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isTest, setIsTest] = useState(false);

  const openModal = (pkg = null, testMode = false) => {
    setSelectedPackage(pkg);
    setIsTest(testMode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedPackage(null);
      setIsTest(false);
    }, 300); // Clear after animation
  };

  return (
    <OrderModalContext.Provider value={{ isOpen, selectedPackage, isTest, openModal, closeModal }}>
      {children}
    </OrderModalContext.Provider>
  );
};

export const useOrderModal = () => {
  const context = useContext(OrderModalContext);
  if (!context) {
    throw new Error('useOrderModal must be used within an OrderModalProvider');
  }
  return context;
};
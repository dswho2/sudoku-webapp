// src/context/ModalContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ModalType = 'auth' | 'stats' | 'difficulty' | null;

interface ModalContextType {
  modal: ModalType;

  // in modal: transition-opacity duration-300 ${ closing ? 'animate-fade-out' : 'animate-fade-in'}`}
  closing: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  modal: null,
  closing: false,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalType>(null);
  const [closing, setClosing] = useState(false);

  const openModal = (type: ModalType) => {
    setClosing(false);
    setModal(type);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModal(null);
      setClosing(false);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ modal, closing, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

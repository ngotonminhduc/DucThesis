"use client";

import React, { useState, ReactNode } from "react";
import Modal from "./Modal";
import { ModalOptions } from "./type";
import { ModalContext } from "@/hooks/useModal";

// Provider Component
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    size: "md",
    closeOnOutsideClick: true,
    showCloseButton: true,
  });

  const openModal = React.useCallback(
    <T,>(
      Component: React.ComponentType<T>,
      props?: Omit<T, "onClose">,
      options?: ModalOptions
    ) => {
      setModalOptions((prev) => ({ ...prev, ...options }));
      setModalContent(
        <Component {...(props as T)} onClose={() => closeModal()} />
      );
      setIsOpen(true);
    },
    []
  );

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Wait for animation to complete
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size={modalOptions.size}
        closeOnOutsideClick={modalOptions.closeOnOutsideClick}
        showCloseButton={modalOptions.showCloseButton}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

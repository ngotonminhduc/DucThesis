import { ModalOptions } from "@/components/modal/type";
import { createContext, useContext } from "react";

// Types for modal context
interface ModalContextType {
  openModal: <T>(
    Component: React.ComponentType<T>,
    props?: Omit<T, "onClose">,
    options?: ModalOptions
  ) => void;
  closeModal: () => void;
}

// Create context
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

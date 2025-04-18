import { ReactNode } from "react";

export interface ModalOptions {
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}
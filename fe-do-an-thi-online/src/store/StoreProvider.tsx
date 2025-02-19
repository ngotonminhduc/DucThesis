// store/StoreProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useGlobalStore } from "./global-store";

// ✅ Lấy kiểu dữ liệu chính xác từ Zustand
type StoreType = ReturnType<typeof useGlobalStore>;

// ✅ Không truyền giá trị mặc định vào `createContext()`
const StoreContext = createContext<StoreType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useGlobalStore(); // Zustand store

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

// ✅ Custom Hook để lấy Store
export function useStore(): StoreType {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

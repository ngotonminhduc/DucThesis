"use client";

import AuthScreen from "@/components/auth/AuthScreen";
import { useAuthStore } from "@/store/auth-store";

export default function Auth() {
  const { type } = useAuthStore();
  return (
    <main className="flex items-center justify-center h-screen overflow-auto">
      <section className="h-screen overflow-auto">
        <AuthScreen type={type} />
      </section>
    </main>
  );
}

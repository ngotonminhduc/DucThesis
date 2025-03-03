"use client";

import AuthScreen from "@/components/auth/AuthScreen";

export default function Home() {

  return (
    <main className="flex items-center justify-center h-screen">
      <section className="h-screen overflow-hidden">
        <AuthScreen />
      </section>
    </main>
  );
}

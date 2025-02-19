// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [isMounted, setIsMounted] = useState(false);

  if (!isMounted) return null; // Prevent hydration error


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">User Profile</h1>
      
    </div>
  );
}

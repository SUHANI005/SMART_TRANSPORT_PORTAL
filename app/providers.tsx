"use client";

import { SessionProvider } from "next-auth/react";
import { LangProvider } from "@/lib/lang-context";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LangProvider>
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </LangProvider>
    </SessionProvider>
  );
}

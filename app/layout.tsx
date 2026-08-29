import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";

export const metadata: Metadata = {
  title: "Smart Transport Services Portal",
  description: "A friendly digital transport assistant for driving licences, vehicle services, permits, and challan payments."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <AIAssistantWidget />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/Providers";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emerald – Curated Style for Modern Life",
  description: "Shop the finest collection of clothing, accessories, and everyday essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="scroll-smooth">{children}</main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ["latin"], variable: "--font-poppins" });

export const metadata = {
  title: "PMS - Pharmacy Management System",
  description: "Advanced Pharmacy Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-[#f1f5f9] text-foreground antialiased selection:bg-primary-500/30 selection:text-primary-300`}>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all">
            <Header />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

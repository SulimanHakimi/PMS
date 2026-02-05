import { Inter, Poppins, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ["latin"], variable: "--font-poppins" });
const notoNaskh = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-noto-naskh" });

export const metadata = {
  title: "PMS - Pharmacy Management System",
  description: "Advanced Pharmacy Management System",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="fa-AF" dir="rtl">
      <body suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${notoNaskh.variable} font-sans bg-[#f1f5f9] text-foreground antialiased selection:bg-primary-500/30 selection:text-primary-300`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

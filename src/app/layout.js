import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ["latin"], variable: "--font-poppins" });

export const metadata = {
  title: "PMS - Pharmacy Management System",
  description: "Advanced Pharmacy Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-background text-foreground antialiased selection:bg-primary-500/30 selection:text-primary-300`}>
        {children}
      </body>
    </html>
  );
}

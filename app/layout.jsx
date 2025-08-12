import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider} from '@clerk/nextjs';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "sleep tracker",
  description: "A simple sleep tracker",
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider>
     <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Navbar/>
         {children}
         <Footer/>
       </body>
     </html>
    </ClerkProvider>
  );
}

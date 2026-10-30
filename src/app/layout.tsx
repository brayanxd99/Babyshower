import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SELAH | Calma en tu día, fe en tu historia",
  description: "Promesa que dio fruto a la idea de negocio. Calma en tu día, fe en tu historia.",
  icons: {
    icon: "/selah-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#fcf2f4] text-[#4a2632] min-h-screen antialiased selection:bg-[#a75470] selection:text-white">
        {children}
      </body>
    </html>
  );
}

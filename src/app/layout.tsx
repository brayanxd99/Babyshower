import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fcf2f4",
};

export const metadata: Metadata = {
  title: "SELAH Promesas | Calma en tu día, fe en tu historia",
  description: "Promesa que dió fruto a la idea de negocio. Calma en tu día, fe en tu historia. @selah_promesas",
  metadataBase: new URL("https://babyshower-ochre.vercel.app"),
  openGraph: {
    title: "SELAH Promesas | Calma en tu día, fe en tu historia",
    description: "Promesa que dió fruto a la idea de negocio. Calma en tu día, fe en tu historia.",
    url: "https://babyshower-ochre.vercel.app",
    siteName: "SELAH Promesas",
    images: [
      {
        url: "/selah-logo.png",
        width: 765,
        height: 323,
        alt: "SELAH Promesas",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SELAH Promesas | Calma en tu día, fe en tu historia",
    description: "Promesa que dió fruto a la idea de negocio. Calma en tu día, fe en tu historia.",
    images: ["/selah-logo.png"],
  },
  icons: {
    icon: "/selah-logo.png",
    apple: "/selah-logo.png",
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

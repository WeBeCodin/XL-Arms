import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XL Arms - Professional Firearms Services",
  description: "XL Arms provides professional firearms services including transfers, FFL services, and inventory management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}

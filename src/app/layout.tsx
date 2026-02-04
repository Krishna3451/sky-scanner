import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skyscanner | Compare cheap flights, hotels & car hire",
  description: "Compare cheap flights, hotels and car hire from over 1,200 providers to find the best deals. Search your trip now on Skyscanner.",
  keywords: "flights, cheap flights, hotels, car hire, travel, skyscanner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

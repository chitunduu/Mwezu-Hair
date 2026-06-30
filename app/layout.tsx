import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mwezu Hair Salon | Where Beauty Meets Expertise",
  description:
    "Book your next style at Mwezu Hair Salon — Northmead Market, Lusaka. Braids, sew-ins, twists & extensions by a team that knows hair.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
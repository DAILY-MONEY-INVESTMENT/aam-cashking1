import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import WhatsAppButton from "@/components/WhatsAppButton";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "A.A.M CASH KING1 INTERNETS",
  description:
    "Airtel unlimited data and premium file packages. Pay via Mobile Money, upload proof, get connected.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <Loader />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}

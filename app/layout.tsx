import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { RootShell } from "@/components/RootShell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkAja PUTAR — Penghasilan Masuk, Untung Otomatis, Transaksi Rutin",
  description:
    "Tunjangan & penghasilan masuk, otomatis terbagi ke kantong, tumbuh lewat reksa dana pasar uang, lalu berputar di transit, Pertamina, dan tagihan. LinkAja PUTAR.",
  applicationName: "LinkAja PUTAR",
  icons: {
    icon: "/linkaja-logo.png",
    apple: "/linkaja-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e11b22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}

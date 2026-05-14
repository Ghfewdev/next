import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const notoThai = localFont({
  src: [
    {
      path: "../fonts/SaoChingcha-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/SaoChingcha-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SaoChingcha-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/BKKDraft5-Regular.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "ตรวจสอบข้อมูลคู่ค้า",
  description: "ตรวจสอบข้อมูลคู่ค้าภาครัฐ สำนักการแพทย์ กรุงเทพมหานคร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoThai.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

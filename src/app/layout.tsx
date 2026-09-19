import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontreal = localFont({
  src: [
    {
      path: "../fonts/PPNeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PPNeueMontreal-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
});

const ppEiko = localFont({
  src: "../fonts/PPEiko-RegularItalic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-pp-eiko",
});

const fragmentMono = localFont({
  src: "../fonts/FragmentMono-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-fragment-mono",
});

export const metadata: Metadata = {
  title: "Adrz - Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${neueMontreal.variable} ${ppEiko.variable} ${fragmentMono.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

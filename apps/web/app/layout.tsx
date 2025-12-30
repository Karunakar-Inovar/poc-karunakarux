"use client";
import { Plus_Jakarta_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "ui";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetBrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${plusJakartaSans.variable} ${dmSerifDisplay.variable} ${jetBrainsMono.variable} h-full font-sans`}>
        <ThemeProvider defaultTheme="light" storageKey="aegis-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

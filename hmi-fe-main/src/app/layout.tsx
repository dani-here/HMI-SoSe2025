import type { Metadata } from "next";
import "./globals.css";
import { StudyProvider } from "@/context/StudyContext";

export const metadata: Metadata = {
  title: "AI Interaction Study",
  description: "A research study on human-AI interaction patterns",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StudyProvider>
          {children}
        </StudyProvider>
      </body>
    </html>
  );
}

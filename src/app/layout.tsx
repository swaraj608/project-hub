
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Hub",
  description:
    "A modern workspace to capture ideas, explore innovations, experiment with concepts, and organize projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

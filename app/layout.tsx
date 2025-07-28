import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

// export const metadata: Metadata = {
//   title: "ManiShah - Dev Journey",
//   description: "Sharing my development experiences and learnings",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";

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
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { ErrorBoundary } from "components/error-boundary";
import Navigation from "components/ui/navigation";
import ConditionalFooter from "./components/conditional-footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sideline Prototype",
  description:
    "Share your dietary requirements instantly with restaurants and hosts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        <ErrorBoundary>
          <Providers>
            <Navigation />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

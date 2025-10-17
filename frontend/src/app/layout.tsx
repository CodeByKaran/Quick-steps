import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientProvider from "@/context/QueryClient";
import NavBarWrapper from "@/components/navbar-wrapper";

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Qick-Steps",
  description:
    "quicksnippets is a storage for quick and useful codes and commands snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>
            <NavBarWrapper />

            <main className="">{children}</main>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

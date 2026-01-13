import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "~/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Book Worm",
  description:
    "A Personalized Book Recommendation & Reading Tracker Application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  error: "bg-destructive text-destructive-foreground",
                  success: "bg-primary text-primary-foreground",
                  warning: "bg-accent text-accent-foreground",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

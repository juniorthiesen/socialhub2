import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LayoutClient } from '@/components/layout-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Engagement Hub',
  description: 'Automate your social media engagement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutClient>
            {children}
          </LayoutClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
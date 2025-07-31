import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { KanbanProvider } from '@/lib/kanban-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'YouTube Sponsorship Workflow',
  description: 'Manage YouTube sponsorship deals with Gmail integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="global-error-handler" strategy="beforeInteractive">
          {`
            window.addEventListener('error', function(event) {
              if (event.error && event.error.message) {
                if (event.error.message.includes('NetworkError') || 
                    event.error.message.includes('fetch')) {
                  console.warn('Network error detected:', event.error.message);
                  event.preventDefault();
                }
              }
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KanbanProvider>{children}</KanbanProvider>
      </body>
    </html>
  );
}

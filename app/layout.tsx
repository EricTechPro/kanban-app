import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

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
              console.error('[Global Error Handler] Caught error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
              });
            });

            window.addEventListener('unhandledrejection', function(event) {
              console.error('[Global Error Handler] Unhandled promise rejection:', {
                reason: event.reason,
                promise: event.promise,
                timestamp: new Date().toISOString()
              });
            });

            // Log when the app starts
            console.log('[App] YouTube Sponsorship Workflow starting...', {
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

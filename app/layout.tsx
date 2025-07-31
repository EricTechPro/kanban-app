import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { KanbanProvider } from '@/lib/kanban-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'YouTube Sponsorship Manager',
  description: 'Manage your YouTube sponsorship deals with a Kanban board',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KanbanProvider>{children}</KanbanProvider>
      </body>
    </html>
  );
}

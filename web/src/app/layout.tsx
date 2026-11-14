import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerSignal — AI-Powered Job & Hiring Intelligence',
  description: 'Real-time global job news intelligence, hiring surge detection, and interactive labor map.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

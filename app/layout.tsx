import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr. Saad El Mahdy — Therapy Sessions',
  description: 'Book a therapy session with Dr. Saad El Mahdy. Find available slots, book online, and pay offline via Instapay or Vodafone Cash.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}

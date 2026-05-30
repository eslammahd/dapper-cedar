import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr. Saad El Mahdy — Book a Session',
  description: 'Book a therapy session with Dr. Saad El Mahdy. Find an available slot, book online, and pay offline via Instapay or Vodafone Cash.',
  openGraph: {
    title: 'Dr. Saad El Mahdy — Book a Session',
    description: 'Book a therapy session online. No account needed.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

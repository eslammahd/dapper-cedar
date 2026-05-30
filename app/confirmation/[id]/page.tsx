'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { BookingWithSlot } from '@/lib/supabase';
import ConfirmationCard from '@/components/ConfirmationCard';

export default function ConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<BookingWithSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/booking/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBooking(data.booking);
      })
      .catch(() => setError('Could not load booking details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">{error || 'Booking not found.'}</p>
          <a href="/" className="mt-4 inline-block text-teal-600 underline">Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <ConfirmationCard booking={booking} />
    </main>
  );
}

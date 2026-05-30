'use client';

import { useEffect, useState } from 'react';
import type { Slot } from '@/lib/supabase';
import BookingModal from '@/components/BookingModal';
import HeroSection from '@/components/HeroSection';
import SlotsGrid from '@/components/SlotsGrid';

export default function HomePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSlots(data.slots || []);
      })
      .catch(() => setError('Failed to load slots. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const handleBookingComplete = (bookingId: string) => {
    setSelectedSlot(null);
    window.location.href = `/confirmation/${bookingId}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <section id="slots" className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Available Slots</h2>
        <p className="text-gray-500 mb-8">Choose a time that works for you — no account needed.</p>
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        )}
        {!loading && !error && (
          <SlotsGrid slots={slots} onSelect={setSelectedSlot} />
        )}
      </section>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingComplete}
        />
      )}
    </main>
  );
}

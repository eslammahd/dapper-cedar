'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase, Slot } from '@/lib/supabase';
import BookingModal from '@/components/BookingModal';
import ConfirmationCard from '@/components/ConfirmationCard';

type GroupedSlots = Record<string, Slot[]>;

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export default function Home() {
  const [slots, setSlots] = useState<GroupedSlots>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState<{ name: string; slotDate: string; slotTime: string } | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('is_available', true)
      .gte('date', today)
      .order('date')
      .order('time');

    if (!error && data) {
      const grouped: GroupedSlots = {};
      data.forEach((slot: Slot) => {
        if (!grouped[slot.date]) grouped[slot.date] = [];
        grouped[slot.date].push(slot);
      });
      setSlots(grouped);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleBooked = (name: string, slotDate: string, slotTime: string) => {
    setSelectedSlot(null);
    setBooking({ name, slotDate, slotTime });
    fetchSlots();
  };

  if (booking) {
    return (
      <ConfirmationCard
        name={booking.name}
        slotDate={booking.slotDate}
        slotTime={booking.slotTime}
        onBookAnother={() => setBooking(null)}
      />
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero / Profile */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-brand-400 flex items-center justify-center text-5xl font-bold shadow-lg">
              S
            </div>
          </div>
          <div>
            <p className="text-brand-200 text-sm font-medium uppercase tracking-widest mb-1">Licensed Therapist · MD</p>
            <h1 className="text-4xl font-bold mb-2">Dr. Saad El Mahdy</h1>
            <p className="text-brand-100 text-lg leading-relaxed max-w-xl">
              Compassionate therapy sessions tailored to your needs. Book a slot online — no account required — and pay at your convenience offline.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm">Individual Therapy</span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm">Couples Therapy</span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm">Family Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-center text-slate-500 text-xs font-semibold uppercase tracking-widest mb-7">How it works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔍', label: 'Find a slot' },
              { icon: '📋', label: 'Book online' },
              { icon: '💳', label: 'Pay offline' },
              { icon: '🤝', label: 'We meet' },
            ].map((step, i) => (
              <div key={i}>
                <div className="text-3xl mb-2">{step.icon}</div>
                <p className="text-sm font-medium text-slate-700">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slots */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Available Sessions</h2>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && Object.keys(slots).length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg">No available slots at the moment.</p>
            <p className="text-sm mt-1">Please check back soon.</p>
          </div>
        )}

        {!loading && Object.entries(slots).map(([date, daySlots]) => (
          <div key={date} className="mb-10">
            <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-4">
              {formatDate(date)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {daySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="group relative bg-white border border-slate-200 rounded-xl px-4 py-4 text-left shadow-sm hover:border-brand-400 hover:shadow-md transition-all duration-150"
                >
                  <p className="text-base font-semibold text-slate-800 group-hover:text-brand-700">
                    {formatTime(slot.time)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{slot.duration} min</p>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white mt-8">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Dr. Saad El Mahdy. All rights reserved.</p>
          <p>Payments via <span className="font-medium text-slate-600">Instapay</span> · <span className="font-medium text-slate-600">Vodafone Cash</span></p>
        </div>
      </footer>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onBooked={handleBooked}
        />
      )}
    </main>
  );
}

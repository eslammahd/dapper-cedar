'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import BookingModal from '@/components/BookingModal';
import ConfirmationCard from '@/components/ConfirmationCard';

type Slot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  is_available: boolean;
};

type GroupedSlots = Record<string, Slot[]>;

function fmt(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function fmtTime(t: string) {
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function Home() {
  const [slots, setSlots] = useState<GroupedSlots>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState<{ name: string; slotDate: string; slotTime: string } | null>(null);

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await sb
      .from('slots')
      .select('*')
      .eq('is_available', true)
      .gte('date', today)
      .order('date')
      .order('time');

    if (!error && data) {
      const grouped: GroupedSlots = {};
      (data as Slot[]).forEach(slot => {
        if (!grouped[slot.date]) grouped[slot.date] = [];
        grouped[slot.date].push(slot);
      });
      setSlots(grouped);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  if (booking) {
    return <ConfirmationCard name={booking.name} slotDate={booking.slotDate} slotTime={booking.slotTime} onBookAnother={() => setBooking(null)} />;
  }

  return (
    <main className="min-h-screen">
      <section className="bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold flex-shrink-0">S</div>
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">Licensed Therapist MD</p>
            <h1 className="text-4xl font-bold mb-2">Dr. Saad El Mahdy</h1>
            <p className="text-blue-100 text-base leading-relaxed max-w-lg">
              Compassionate therapy sessions tailored to your needs. Book online — no account required — and pay offline at your convenience.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Individual Therapy', 'Couples Therapy', 'Family Sessions'].map(tag => (
                <span key={tag} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[{e:'&#128269;',l:'Find a slot'},{e:'&#128203;',l:'Book online'},{e:'&#128179;',l:'Pay offline'},{e:'&#129309;',l:'We meet'}].map((s,i) => (
              <div key={i}>
                <div className="text-3xl mb-1" dangerouslySetInnerHTML={{__html: s.e}} />
                <p className="text-sm font-medium text-slate-700">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Available Sessions</h2>
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && Object.keys(slots).length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">&#128197;</p>
            <p className="text-lg">No available slots right now.</p>
            <p className="text-sm mt-1">Please check back soon.</p>
          </div>
        )}
        {!loading && Object.entries(slots).map(([date, daySlots]) => (
          <div key={date} className="mb-10">
            <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-4">{fmt(date)}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {daySlots.map(slot => (
                <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                  className="relative bg-white border border-slate-200 rounded-xl px-4 py-4 text-left shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
                  <p className="text-base font-semibold text-slate-800">{fmtTime(slot.time)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{slot.duration} min</p>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Dr. Saad El Mahdy</p>
          <p>Pay via <span className="font-medium text-slate-600">Instapay</span> or <span className="font-medium text-slate-600">Vodafone Cash</span></p>
        </div>
      </footer>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onBooked={(name, date, time) => { setSelectedSlot(null); setBooking({ name, slotDate: date, slotTime: time }); fetchSlots(); }}
        />
      )}
    </main>
  );
}

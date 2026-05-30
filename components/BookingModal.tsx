'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Slot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  is_available: boolean;
};

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

const SESSION_TYPES = ['Individual Therapy', 'Couples Therapy', 'Family Session', 'First Consultation'];

interface Props {
  slot: Slot;
  onClose: () => void;
  onBooked: (name: string, slotDate: string, slotTime: string) => void;
}

export default function BookingModal({ slot, onClose, onBooked }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionType, setSessionType] = useState(SESSION_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) { setError('Please fill in all fields.'); return; }
    setSubmitting(true);

    const { error: bookingError } = await sb.from('bookings').insert({
      slot_id: slot.id,
      patient_name: name.trim(),
      phone: phone.trim(),
      session_type: sessionType,
      status: 'pending',
    });

    if (bookingError) {
      setError('This slot may have just been taken. Please choose another.');
      setSubmitting(false);
      return;
    }

    await sb.from('slots').update({ is_available: false }).eq('id', slot.id);
    onBooked(name.trim(), slot.date, slot.time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-brand-700 px-6 py-5 text-white">
          <p className="text-xs uppercase tracking-widest mb-1 text-blue-200">Book a session</p>
          <p className="text-xl font-bold">{fmt(slot.date)}</p>
          <p className="text-sm mt-0.5 text-blue-100">{fmtTime(slot.time)} &middot; {slot.duration} min</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
            <select value={sessionType} onChange={e => setSessionType(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              {SESSION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-lg py-3 transition-colors">
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 py-1">Cancel</button>
        </form>
      </div>
    </div>
  );
}

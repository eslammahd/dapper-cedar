'use client';
import { useState } from 'react';
import { supabase, Slot } from '@/lib/supabase';

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

const SESSION_TYPES = [
  'Individual Therapy',
  'Couples Therapy',
  'Family Session',
  'First Consultation',
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);

    // Mark slot unavailable + create booking in one transaction-like sequence
    const { error: bookingError } = await supabase.from('bookings').insert({
      slot_id: slot.id,
      patient_name: name.trim(),
      phone: phone.trim(),
      session_type: sessionType,
      status: 'pending',
    });

    if (bookingError) {
      setError('This slot was just taken. Please choose another.');
      setSubmitting(false);
      return;
    }

    const { error: slotError } = await supabase
      .from('slots')
      .update({ is_available: false })
      .eq('id', slot.id);

    if (slotError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    onBooked(name.trim(), slot.date, slot.time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-5 text-white">
          <p className="text-brand-200 text-xs uppercase tracking-widest mb-1">Booking session</p>
          <p className="text-xl font-bold">{formatDate(slot.date)}</p>
          <p className="text-brand-100 text-sm mt-0.5">{formatTime(slot.time)} · {slot.duration} min</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            >
              {SESSION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-lg py-3 transition-colors"
          >
            {submitting ? 'Booking…' : 'Confirm Booking'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 py-1">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

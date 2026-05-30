import type { BookingWithSlot } from '@/lib/supabase';

type Props = {
  booking: BookingWithSlot;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

export default function ConfirmationCard({ booking }: Props) {
  const slot = booking.slots;

  return (
    <div className="w-full max-w-lg">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 text-3xl mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
        <p className="text-gray-500 mt-1">We'll see you soon, {booking.patient_name.split(' ')[0]}.</p>
      </div>

      {/* Booking details */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Appointment Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Doctor</span>
            <span className="text-gray-800 font-medium text-sm">Dr. Saad El Mahdy</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Date</span>
            <span className="text-gray-800 font-medium text-sm">{formatDate(slot.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Time</span>
            <span className="text-gray-800 font-medium text-sm">{formatTime(slot.time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Duration</span>
            <span className="text-gray-800 font-medium text-sm">{slot.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Session Type</span>
            <span className="text-gray-800 font-medium text-sm">{booking.session_type}</span>
          </div>
        </div>
      </div>

      {/* Payment instructions */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wide mb-4">💳 Payment Instructions</h2>
        <p className="text-teal-700 text-sm mb-4">Please complete your payment before the session using one of the methods below:</p>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-teal-100">
            <p className="font-semibold text-gray-800 text-sm mb-1">📲 Instapay</p>
            <p className="text-gray-600 text-sm">IPA: <span className="font-mono font-medium text-gray-900">saad.elmahdy</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-teal-100">
            <p className="font-semibold text-gray-800 text-sm mb-1">📱 Vodafone Cash</p>
            <p className="text-gray-600 text-sm">Number: <span className="font-mono font-medium text-gray-900">010XXXXXXXX</span></p>
          </div>
        </div>
        <p className="text-teal-600 text-xs mt-4">Send a screenshot of your payment to confirm. Dr. Saad will reach out to you at the provided phone number.</p>
      </div>

      {/* Booking reference */}
      <div className="text-center">
        <p className="text-xs text-gray-400 mb-1">Booking Reference</p>
        <p className="font-mono text-sm text-gray-600">{booking.id}</p>
        <a href="/" className="mt-4 inline-block text-teal-600 text-sm hover:underline">← Book another slot</a>
      </div>
    </div>
  );
}

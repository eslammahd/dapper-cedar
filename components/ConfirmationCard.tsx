'use client';

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

interface Props {
  name: string;
  slotDate: string;
  slotTime: string;
  onBookAnother: () => void;
}

export default function ConfirmationCard({ name, slotDate, slotTime, onBookAnother }: Props) {
  return (
    <main className="min-h-screen bg-blue-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-green-500 px-6 py-5 text-white text-center">
          <div className="text-4xl mb-2">&#10003;</div>
          <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          <p className="text-green-100 text-sm mt-1">See you soon, {name.split(' ')[0]}.</p>
        </div>
        <div className="px-6 py-6">
          <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Patient</span><span className="font-semibold">{name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-semibold">{fmt(slotDate)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-semibold">{fmtTime(slotTime)}</span></div>
          </div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Payment Instructions</h3>
          <p className="text-xs text-slate-500 mb-3">Please send your session fee before the appointment:</p>
          <div className="space-y-3">
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-sm text-slate-800 mb-1">Instapay</p>
              <p className="text-xs text-slate-500">IPA: <span className="font-mono font-semibold text-slate-700">dr.saad.elmahdy</span></p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-sm text-slate-800 mb-1">Vodafone Cash</p>
              <p className="text-xs text-slate-500">Number: <span className="font-mono font-semibold text-slate-700">01XXXXXXXXXX</span></p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">After payment you are all set. We meet at your booked time.</p>
          <button onClick={onBookAnother}
            className="mt-6 w-full border border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg py-2.5 text-sm transition-colors">
            Back to slots
          </button>
        </div>
      </div>
    </main>
  );
}

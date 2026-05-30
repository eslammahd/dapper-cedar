import type { Slot } from '@/lib/supabase';

type Props = {
  slots: Slot[];
  onSelect: (slot: Slot) => void;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

function groupByDate(slots: Slot[]) {
  const groups: Record<string, Slot[]> = {};
  for (const slot of slots) {
    if (!groups[slot.date]) groups[slot.date] = [];
    groups[slot.date].push(slot);
  }
  return groups;
}

export default function SlotsGrid({ slots, onSelect }: Props) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl">No available slots at the moment.</p>
        <p className="text-sm mt-2">Please check back soon.</p>
      </div>
    );
  }

  const groups = groupByDate(slots);

  return (
    <div className="space-y-10">
      {Object.entries(groups).map(([date, daySlots]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-3">
            {formatDate(date)}
          </h3>
          <div className="flex flex-wrap gap-3">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onSelect(slot)}
                className="px-5 py-2.5 rounded-full border-2 border-teal-500 text-teal-700 font-medium hover:bg-teal-500 hover:text-white transition text-sm"
              >
                {formatTime(slot.time)}
                <span className="ml-1.5 text-xs opacity-70">{slot.duration} min</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

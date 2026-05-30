import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slot_id, patient_name, phone, session_type, notes } = body;

  if (!slot_id || !patient_name || !phone) {
    return NextResponse.json(
      { error: 'Missing required fields: slot_id, patient_name, phone' },
      { status: 400 }
    );
  }

  // Check slot is still available
  const { data: slot, error: slotError } = await supabase
    .from('slots')
    .select('*')
    .eq('id', slot_id)
    .eq('is_available', true)
    .single();

  if (slotError || !slot) {
    return NextResponse.json(
      { error: 'This slot is no longer available. Please choose another.' },
      { status: 409 }
    );
  }

  // Check no confirmed booking exists for this slot
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('slot_id', slot_id)
    .eq('status', 'confirmed')
    .single();

  if (existing) {
    return NextResponse.json(
      { error: 'This slot was just booked. Please choose another.' },
      { status: 409 }
    );
  }

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      slot_id,
      patient_name: patient_name.trim(),
      phone: phone.trim(),
      session_type: session_type || 'Individual Therapy',
      notes: notes || null,
      status: 'confirmed',
    })
    .select()
    .single();

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 });
  }

  // Mark slot as unavailable
  await supabase
    .from('slots')
    .update({ is_available: false })
    .eq('id', slot_id);

  return NextResponse.json({ booking }, { status: 201 });
}

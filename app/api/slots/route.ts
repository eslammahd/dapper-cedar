import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('is_available', true)
    .gte('date', today)
    .order('date')
    .order('time');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

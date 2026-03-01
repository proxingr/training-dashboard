import { supabase } from '@/lib/supabase';
import type { Participant } from '@/types';
import ParticipantsClient from './ParticipantsClient';

export const dynamic = 'force-dynamic';

async function getParticipants() {
  const { data, error } = await supabase
    .from('participants')
    .select('*, profiles(id, email, full_name, phone, role), lgas(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
  return data as (Participant & { profiles: { id: string; email: string; full_name: string; phone: string | null; role: string }; lgas: { name: string } | null })[];
}

export default async function ParticipantsPage() {
  const participants = await getParticipants();
  return <ParticipantsClient participants={participants} />;
}

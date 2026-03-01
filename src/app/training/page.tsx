import { supabase } from '@/lib/supabase';
import type { Training } from '@/types';

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  upcoming: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700',
};

async function getTrainings() {
  const { data, error } = await supabase
    .from('training')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trainings:', error);
    return [];
  }
  return data as Training[];
}

async function getParticipantCounts() {
  // Get count of participants per training via sessions + attendance
  const { data } = await supabase
    .from('sessions')
    .select('training_id, attendance(id)');
  
  const counts: Record<string, number> = {};
  if (data) {
    for (const session of data) {
      const tid = session.training_id;
      const attArr = session.attendance as { id: string }[] | null;
      const cnt = attArr?.length ?? 0;
      counts[tid] = (counts[tid] ?? 0) + cnt;
    }
  }
  return counts;
}

export default async function TrainingPage() {
  const [trainings, participantCounts] = await Promise.all([
    getTrainings(),
    getParticipantCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training Programs</h1>
        <p className="text-sm text-gray-500 mt-1">{trainings.length} training programs found</p>
      </div>

      {trainings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-gray-500">No training programs found.</p>
          <p className="text-gray-400 text-sm mt-1">Create a training program to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainings.map((t) => {
            const color = statusColors[t.status ?? 'draft'] ?? statusColors.draft;
            return (
              <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{t.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${color}`}>
                    {t.status ?? 'draft'}
                  </span>
                </div>
                {t.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{t.description}</p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>
                      {t.start_date ? new Date(t.start_date).toLocaleDateString() : 'TBD'}
                      {t.end_date && ` — ${new Date(t.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                  {t.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span>{t.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>👥</span>
                    <span>
                      {participantCounts[t.id] ?? 0}
                      {t.max_participants ? ` / ${t.max_participants}` : ''} participants
                    </span>
                  </div>
                  {t.budget != null && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>💰</span>
                      <span>₦{t.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

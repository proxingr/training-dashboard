import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface SessionRow {
  id: string;
  title: string;
  description: string | null;
  session_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  created_at: string;
  training: { name: string } | null;
  facilitator: { full_name: string } | null;
  attendance: { id: string }[];
}

async function getSessions(): Promise<SessionRow[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      training(name),
      facilitator:profiles!sessions_facilitator_id_fkey(full_name),
      attendance(id)
    `)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return (data ?? []) as SessionRow[];
}

function formatTime(time: string | null): string {
  if (!time) return 'TBD';
  return time.slice(0, 5);
}

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training Sessions</h1>
        <p className="text-sm text-gray-500 mt-1">{sessions.length} sessions found</p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🗓️</p>
          <p className="text-gray-500">No sessions found.</p>
          <p className="text-gray-400 text-sm mt-1">Sessions will appear here once created.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Session Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Training Program</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Facilitator</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Location</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => {
                  const isUpcoming = s.session_date ? new Date(s.session_date) >= new Date(new Date().toISOString().split('T')[0]) : false;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUpcoming ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="font-medium text-gray-900">{s.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {s.training?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {s.session_date ? new Date(s.session_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {formatTime(s.start_time)} — {formatTime(s.end_time)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {s.facilitator?.full_name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {s.location ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          👥 {s.attendance?.length ?? 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

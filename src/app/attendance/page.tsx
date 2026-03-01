import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface AttendanceRow {
  id: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  notes: string | null;
  sessions: {
    title: string;
    session_date: string | null;
    training: { name: string } | null;
  } | null;
  participants: {
    id: string;
    profiles: { full_name: string; email: string } | null;
  } | null;
}

async function getAttendanceRecords(): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      sessions(title, session_date, training(name)),
      participants(id, profiles(full_name, email))
    `)
    .order('checked_in_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
  return (data ?? []) as AttendanceRow[];
}

function formatDateTime(dt: string | null): string {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AttendancePage() {
  const records = await getAttendanceRecords();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">{records.length} attendance records</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-500">No attendance records found.</p>
          <p className="text-gray-400 text-sm mt-1">Attendance will be recorded as participants check in to sessions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Participant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Session</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Training</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Session Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-In</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Check-Out</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((r) => {
                  const hasCheckedOut = !!r.checked_out_at;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {r.participants?.profiles?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{r.participants?.profiles?.full_name ?? 'Unknown'}</p>
                            <p className="text-xs text-gray-400 hidden sm:block">{r.participants?.profiles?.email ?? ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{r.sessions?.title ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{r.sessions?.training?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {r.sessions?.session_date ? new Date(r.sessions.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDateTime(r.checked_in_at)}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{formatDateTime(r.checked_out_at)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          hasCheckedOut
                            ? 'bg-green-100 text-green-700'
                            : r.checked_in_at
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {hasCheckedOut ? '✓ Complete' : r.checked_in_at ? '● In Session' : '— Absent'}
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

import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface AssessmentRow {
  id: string;
  assessment_type: string;
  is_pre_training: boolean;
  score: number | null;
  completed_at: string | null;
  created_at: string;
  participants: {
    id: string;
    profiles: { full_name: string; email: string } | null;
  } | null;
}

const typeLabels: Record<string, string> = {
  personality: 'Personality',
  emotional_intelligence: 'Emotional Intelligence',
  financial_behavior: 'Financial Behavior',
  stress_resilience: 'Stress Resilience',
};

const typeColors: Record<string, string> = {
  personality: 'bg-violet-100 text-violet-700',
  emotional_intelligence: 'bg-sky-100 text-sky-700',
  financial_behavior: 'bg-emerald-100 text-emerald-700',
  stress_resilience: 'bg-orange-100 text-orange-700',
};

async function getAssessments(): Promise<AssessmentRow[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select(`
      *,
      participants(id, profiles(full_name, email))
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
  return (data ?? []) as AssessmentRow[];
}

async function getStats() {
  const { data } = await supabase
    .from('assessments')
    .select('assessment_type, is_pre_training, score');

  const stats: Record<string, { count: number; avgScore: number; totalScore: number }> = {};
  if (data) {
    for (const row of data) {
      const key = row.assessment_type;
      if (!stats[key]) stats[key] = { count: 0, avgScore: 0, totalScore: 0 };
      stats[key].count++;
      if (row.score != null) stats[key].totalScore += row.score;
    }
    for (const key of Object.keys(stats)) {
      stats[key].avgScore = stats[key].count > 0 ? Math.round(stats[key].totalScore / stats[key].count) : 0;
    }
  }
  return stats;
}

function getScoreColor(score: number | null): string {
  if (score == null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600 font-semibold';
  if (score >= 60) return 'text-yellow-600 font-semibold';
  return 'text-red-600 font-semibold';
}

export default async function AssessmentsPage() {
  const [assessments, stats] = await Promise.all([
    getAssessments(),
    getStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
        <p className="text-sm text-gray-500 mt-1">{assessments.length} assessment records</p>
      </div>

      {/* Stats Summary Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats).map(([type, s]) => (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>
                  {typeLabels[type] ?? type}
                </span>
                <span className="text-lg font-bold text-gray-900">{s.count}</span>
              </div>
              <p className="text-xs text-gray-500">Avg Score: <span className="font-semibold text-gray-700">{s.avgScore}</span></p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(s.avgScore, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assessments Table */}
      {assessments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500">No assessments found.</p>
          <p className="text-gray-400 text-sm mt-1">Assessments will appear here once participants complete them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Participant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Assessment Type</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Phase</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {a.participants?.profiles?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{a.participants?.profiles?.full_name ?? 'Unknown'}</p>
                          <p className="text-xs text-gray-400 hidden sm:block">{a.participants?.profiles?.email ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[a.assessment_type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {typeLabels[a.assessment_type] ?? a.assessment_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.is_pre_training ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {a.is_pre_training ? 'Pre-Training' : 'Post-Training'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-center ${getScoreColor(a.score)}`}>
                      {a.score != null ? a.score : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {a.completed_at
                        ? new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

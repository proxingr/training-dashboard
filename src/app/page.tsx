import { supabase } from '@/lib/supabase';
import type { DashboardStats } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface UpcomingSession {
  id: string;
  title: string;
  session_date: string | null;
  start_time: string | null;
  training: { name: string } | null;
  facilitator: { full_name: string } | null;
}

interface RecentAssessment {
  id: string;
  assessment_type: string;
  is_pre_training: boolean;
  score: number | null;
  completed_at: string | null;
  participants: {
    id: string;
    profiles: { full_name: string } | null;
  } | null;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [participantsRes, trainingsRes, sessionsRes, assessmentsRes] = await Promise.all([
    supabase.from('participants').select('id', { count: 'exact', head: true }),
    supabase.from('training').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sessions').select('id', { count: 'exact', head: true }).gte('session_date', new Date().toISOString().split('T')[0]),
    supabase.from('assessments').select('id', { count: 'exact', head: true }).not('completed_at', 'is', null),
  ]);

  return {
    totalParticipants: participantsRes.count ?? 0,
    activeTrainings: trainingsRes.count ?? 0,
    upcomingSessions: sessionsRes.count ?? 0,
    completedAssessments: assessmentsRes.count ?? 0,
  };
}

async function getUpcomingSessions(): Promise<UpcomingSession[]> {
  const { data } = await supabase
    .from('sessions')
    .select('id, title, session_date, start_time, training(name), facilitator:profiles!sessions_facilitator_id_fkey(full_name)')
    .gte('session_date', new Date().toISOString().split('T')[0])
    .order('session_date', { ascending: true })
    .limit(5);
  return (data as UpcomingSession[] | null) ?? [];
}

async function getRecentAssessments(): Promise<RecentAssessment[]> {
  const { data } = await supabase
    .from('assessments')
    .select('id, assessment_type, is_pre_training, score, completed_at, participants!inner(id, profiles(full_name))')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(5);
  return (data as RecentAssessment[] | null) ?? [];
}

export default async function DashboardPage() {
  const [stats, upcomingSessions, recentAssessments] = await Promise.all([
    getDashboardStats(),
    getUpcomingSessions(),
    getRecentAssessments(),
  ]);

  const statCards = [
    { label: 'Total Participants', value: stats.totalParticipants, icon: '👥', color: 'bg-blue-500', href: '/participants' },
    { label: 'Active Trainings', value: stats.activeTrainings, icon: '📚', color: 'bg-emerald-500', href: '/training' },
    { label: 'Upcoming Sessions', value: stats.upcomingSessions, icon: '🗓️', color: 'bg-purple-500', href: '/sessions' },
    { label: 'Completed Assessments', value: stats.completedAssessments, icon: '📝', color: 'bg-amber-500', href: '/assessments' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s a summary of your training management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts / Visual Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const maxVal = Math.max(...statCards.map(c => c.value), 1);
          const pct = Math.round((card.value / maxVal) * 100);
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">{card.label}</p>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${card.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📅 Upcoming Sessions</h2>
            <Link href="/sessions" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all →</Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No upcoming sessions found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{session.title}</p>
                    <p className="text-xs text-gray-500">
                      {session.session_date} &bull; {session.start_time ? session.start_time.slice(0, 5) : 'TBD'}
                      {session.training?.name && (
                        <span> &bull; {session.training.name}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📝 Recent Assessments</h2>
            <Link href="/assessments" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all →</Link>
          </div>
          {recentAssessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No assessments completed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {assessment.participants?.profiles?.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {assessment.assessment_type?.replace(/_/g, ' ')} &bull; Score: {assessment.score ?? 'N/A'}
                      {assessment.is_pre_training ? ' (Pre)' : ' (Post)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface ParticipantRow {
  id: string;
  position: string | null;
  is_returning: boolean;
  registration_completed: boolean;
  onboarding_completed: boolean;
  assessments_completed: boolean;
  lga_name: string | null;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    role: string;
  };
  lgas: { name: string } | null;
}

export default function ParticipantsClient({ participants }: { participants: ParticipantRow[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRow | null>(null);

  const filtered = participants.filter((p) => {
    const name = p.profiles?.full_name?.toLowerCase() ?? '';
    const email = p.profiles?.email?.toLowerCase() ?? '';
    const lga = p.lga_name?.toLowerCase() ?? p.lgas?.name?.toLowerCase() ?? '';
    const pos = p.position?.toLowerCase() ?? '';
    const q = search.toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || lga.includes(q) || pos.includes(q);

    let matchesStatus = true;
    if (statusFilter === 'registered') matchesStatus = p.registration_completed;
    else if (statusFilter === 'not_registered') matchesStatus = !p.registration_completed;
    else if (statusFilter === 'returning') matchesStatus = p.is_returning;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
          <p className="text-sm text-gray-500 mt-1">{participants.length} total participants registered</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, LGA, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="registered">Registered</option>
            <option value="not_registered">Not Registered</option>
            <option value="returning">Returning</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-2">Showing {filtered.length} of {participants.length} participants</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">LGA</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Position</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Registration</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Onboarding</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Assessments</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <p className="text-gray-400">No participants found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {p.profiles?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <span className="font-medium text-gray-900 truncate">{p.profiles?.full_name ?? 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">{p.profiles?.email ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.lga_name ?? p.lgas?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{p.position ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge done={p.registration_completed} />
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <StatusBadge done={p.onboarding_completed} />
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <StatusBadge done={p.assessments_completed} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedParticipant(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Participant Details</h3>
              <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-3">
              <DetailRow label="Name" value={selectedParticipant.profiles?.full_name} />
              <DetailRow label="Email" value={selectedParticipant.profiles?.email} />
              <DetailRow label="Phone" value={selectedParticipant.profiles?.phone} />
              <DetailRow label="Role" value={selectedParticipant.profiles?.role} />
              <DetailRow label="LGA" value={selectedParticipant.lga_name ?? selectedParticipant.lgas?.name} />
              <DetailRow label="Position" value={selectedParticipant.position} />
              <DetailRow label="Returning" value={selectedParticipant.is_returning ? 'Yes' : 'No'} />
              <DetailRow label="Registration" value={selectedParticipant.registration_completed ? 'Completed' : 'Pending'} />
              <DetailRow label="Onboarding" value={selectedParticipant.onboarding_completed ? 'Completed' : 'Pending'} />
              <DetailRow label="Assessments" value={selectedParticipant.assessments_completed ? 'Completed' : 'Pending'} />
              <DetailRow label="Joined" value={new Date(selectedParticipant.created_at).toLocaleDateString()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ done }: { done: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
      {done ? '✓ Done' : '⏳ Pending'}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value ?? '—'}</span>
    </div>
  );
}

export default function Home() {
  const cards = [
    {
      title: 'Participants',
      description: 'Manage training participants and their profiles',
      icon: '👥',
      count: '—',
    },
    {
      title: 'Training Sessions',
      description: 'View and schedule training sessions',
      icon: '📚',
      count: '—',
    },
    {
      title: 'Attendance',
      description: 'Track attendance across all sessions',
      icon: '✅',
      count: '—',
    },
    {
      title: 'Assessments',
      description: 'Review participant assessments and scores',
      icon: '📝',
      count: '—',
    },
    {
      title: 'Webinars',
      description: 'Manage webinar events and registrations',
      icon: '🎥',
      count: '—',
    },
    {
      title: 'Action Plans',
      description: 'Monitor action plans and implementation tasks',
      icon: '🎯',
      count: '—',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Training Management Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage all training activities in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ● Connected to Supabase
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {card.count}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Info Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Recent Activity
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Activity placeholder {i}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📅 Upcoming Sessions
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Session placeholder {i}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Training Management Dashboard &copy; {new Date().getFullYear()} &mdash; Powered by Next.js &amp; Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}

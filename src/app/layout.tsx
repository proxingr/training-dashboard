import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Training Management Dashboard',
  description: 'Monitor and manage all training activities in one place',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Header Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="lg:hidden w-10" />{/* Spacer for mobile hamburger */}
                <h2 className="text-xl font-semibold text-gray-800">Training Management System</h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ● Connected
                  </span>
                </div>
              </div>
            </header>
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white px-6 py-3">
              <p className="text-center text-xs text-gray-400">
                Training Management Dashboard &copy; {new Date().getFullYear()} &mdash; Powered by Next.js &amp; Supabase
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

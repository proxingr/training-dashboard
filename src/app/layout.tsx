import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Training Management Dashboard',
  description: 'Monitor and manage all training activities in one place',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

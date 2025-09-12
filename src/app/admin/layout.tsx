'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Header from '@/components/admin/Header'
import Footer from '@/components/admin/Footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {!isLoginPage && <Header />}
        <main className="flex-1">
          {children}
        </main>
        {!isLoginPage && <Footer />}
      </div>
    </SessionProvider>
  )
}
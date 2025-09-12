'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, User, Home } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span className="font-semibold text-lg">Dermilise Agenda</span>
            </Button>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/clients')}
            >
              Clientes
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/professionals')}
            >
              Profissionais
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/procedures')}
            >
              Procedimentos
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/appointments')}
            >
              Agendamentos
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-700">
                  {session.user.email}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
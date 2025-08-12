'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button, Card, CardBody, CardHeader } from '@heroui/react'
import { Calendar, Users, UserCheck, Scissors } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!session) {
    return null
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dermilise Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Olá, {session.user?.name}</span>
              <Button color="danger" variant="light" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profissionais</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Scissors className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Procedimentos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/clientes')}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Gestão de Clientes</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">Cadastrar e gerenciar clientes</p>
            </CardBody>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/profissionais')}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Profissionais</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">Gerenciar equipe de profissionais</p>
            </CardBody>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/procedimentos')}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Procedimentos</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">Cadastrar serviços e preços</p>
            </CardBody>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/agendamentos')}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Agendamentos</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">Gerenciar agenda e horários</p>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  )
}
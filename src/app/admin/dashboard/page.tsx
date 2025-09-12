'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, UserCheck, Scissors, Clock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
  agendamentosHoje: number
  totalClientes: number
  totalProfissionais: number
  totalProcedimentos: number
}

interface AgendamentoHoje {
  id: string
  dateTime: string
  client: {
    name: string
    phone: string
  }
  professional: {
    name: string
  }
  procedure: {
    name: string
    price: number
  }
  notes?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    agendamentosHoje: 0,
    totalClientes: 0,
    totalProfissionais: 0,
    totalProcedimentos: 0
  })
  const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoHoje[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchStats = async () => {
    try {
      const [statsResponse, agendamentosResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/appointments?hoje=true')
      ])
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
      
      if (agendamentosResponse.ok) {
        const agendamentosData = await agendamentosResponse.json()
        setAgendamentosHoje(agendamentosData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Redirecionando...</div>
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Redirecionando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-600 mt-2">Visão geral do seu negócio</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchStats}
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            Atualizar
          </Button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClientes}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Profissionais</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProfissionais}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Procedimentos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProcedimentos}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agenda de Hoje */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                Agenda de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {agendamentosHoje.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhum agendamento para hoje</p>
                  <p className="text-gray-400 text-sm mt-2">Aproveite para organizar sua agenda!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agendamentosHoje.map((agendamento) => {
                    const dataHora = new Date(agendamento.dateTime)
                    const horario = dataHora.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    
                    return (
                      <div key={agendamento.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded-lg min-w-[80px] justify-center">
                            <Clock className="h-4 w-4" />
                            {horario}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-900 text-lg">{agendamento.client.name}</span>
                              <Phone className="h-4 w-4 text-gray-500 ml-4" />
                              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{agendamento.client.phone}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold text-purple-600">{agendamento.procedure.name}</span>
                              {' • '}
                              <span className="text-gray-500">Profissional: {agendamento.professional.name}</span>
                            </div>
                            {agendamento.notes && (
                              <div className="text-sm text-gray-500 mt-2 bg-yellow-50 border-l-4 border-yellow-400 pl-3 py-1">
                                <strong>Obs:</strong> {agendamento.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            R$ {Number(agendamento.procedure.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group" onClick={() => router.push('/admin/clients')}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Gestão de Clientes</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Cadastrar e gerenciar clientes</p>
              <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">Acessar →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group" onClick={() => router.push('/admin/professionals')}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Profissionais</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Gerenciar equipe de profissionais</p>
              <div className="mt-4 text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">Acessar →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group" onClick={() => router.push('/admin/procedures')}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Procedimentos</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Cadastrar serviços e preços</p>
              <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700 transition-colors">Acessar →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group" onClick={() => router.push('/admin/appointments')}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Agendamentos</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Gerenciar agenda e horários</p>
              <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700 transition-colors">Acessar →</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, Clock, User, Scissors } from 'lucide-react'
import StatusUpdate from '@/components/admin/StatusUpdate'
import { getStatusLabel, getStatusColor } from '@/lib/status'

interface AppointmentWithDetails {
  id: string
  dateTime: string
  status: string
  notes?: string
  client: {
    id: string
    name: string
    email: string
  }
  professional: {
    id: string
    name: string
    specialty: string
  }
  procedure: {
    id: string
    name: string
    duration: number
    price: number
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/appointments')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar agendamentos')
      }
      
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar agendamentos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    )
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Carregando agendamentos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Agendamentos
            </h1>
            <p className="text-gray-600">Gerencie todos os agendamentos da clínica</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/appointments/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Lista de Agendamentos ({appointments.length})
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={fetchAppointments}
              disabled={isLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            >
              Atualizar
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum agendamento cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro agendamento para organizar a agenda da clínica.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {new Date(appointment.dateTime).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {new Date(appointment.dateTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 font-medium">{appointment.client.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">Dr(a). {appointment.professional.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Scissors className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-700 font-medium">{appointment.procedure.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">({appointment.procedure.duration} min)</span>
                        </div>
                        
                        {appointment.notes && (
                          <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                            <p className="text-sm text-gray-700 italic">
                              <strong>Observações:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/agendamentos/${appointment.id}/edit`)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                        >
                          Editar
                        </Button>
                        <StatusUpdate
                          appointmentId={appointment.id}
                          currentStatus={appointment.status}
                          onStatusUpdate={(newStatus) => handleStatusUpdate(appointment.id, newStatus)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
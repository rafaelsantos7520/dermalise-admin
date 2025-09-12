'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

interface Appointment {
  id: string
  clientName: string
  professionalName: string
  procedureName: string
  appointmentDate: string
  appointmentTime: string
  status: string
  observations: string
}

interface Client {
  id: string
  name: string
}

interface Professional {
  id: string
  name: string
}

interface Procedure {
  id: string
  name: string
}

export default function EditAppointmentPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  
  const [formData, setFormData] = useState({
    clientId: '',
    professionalId: '',
    procedureId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: '',
    observations: ''
  })

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Agendado' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'IN_PROGRESS', label: 'Em Andamento' },
    { value: 'COMPLETED', label: 'Realizado' },
    { value: 'CANCELED', label: 'Cancelado' },
    { value: 'NO_SHOW', label: 'Não Compareceu' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        
        // Carregar o agendamento específico
        const [appointmentRes, clientsRes, professionalsRes, proceduresRes] = await Promise.all([
          fetch(`/api/appointments/${params.id}`),
          fetch('/api/clients'),
          fetch('/api/professionals'),
          fetch('/api/procedures')
        ])

        if (appointmentRes.ok) {
          const appointmentData = await appointmentRes.json()
          setAppointment(appointmentData)
          
          // Formatar a data e hora
          const date = new Date(appointmentData.appointmentDate)
          const formattedDate = date.toISOString().split('T')[0]
          const formattedTime = date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })

          setFormData({
            clientId: appointmentData.clientId || '',
            professionalId: appointmentData.professionalId || '',
            procedureId: appointmentData.procedureId || '',
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            status: appointmentData.status || 'SCHEDULED',
            observations: appointmentData.observations || ''
          })
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json()
          setClients(clientsData)
        }

        if (professionalsRes.ok) {
          const professionalsData = await professionalsRes.json()
          setProfessionals(professionalsData.filter((p: Professional & { active: boolean }) => p.active))
        }

        if (proceduresRes.ok) {
          const proceduresData = await proceduresRes.json()
          setProcedures(proceduresData.filter((p: Procedure & { active: boolean }) => p.active))
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        alert('Erro ao carregar dados do agendamento')
      } finally {
        setLoadingData(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combinar data e hora
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`)

      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          appointmentDate: appointmentDateTime.toISOString()
        }),
      })

      if (response.ok) {
        router.push('/admin/appointments')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error || error.message}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error)
      alert('Erro ao atualizar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Carregando dados do agendamento...</div>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg">Agendamento não encontrado</div>
          <Button onClick={() => router.push('/admin/appointments')} className="mt-4">
            Voltar para Agendamentos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Agendamento</h1>
            <p className="text-gray-600">Atualize os dados do agendamento</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Editar Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium mb-2">
                  Cliente *
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="professionalId" className="block text-sm font-medium mb-2">
                  Profissional *
                </label>
                <select
                  id="professionalId"
                  name="professionalId"
                  value={formData.professionalId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um profissional</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="procedureId" className="block text-sm font-medium mb-2">
                  Procedimento *
                </label>
                <select
                  id="procedureId"
                  name="procedureId"
                  value={formData.procedureId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um procedimento</option>
                  {procedures.map((procedure) => (
                    <option key={procedure.id} value={procedure.id}>
                      {procedure.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium mb-2">
                    Data *
                  </label>
                  <Input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium mb-2">
                    Horário *
                  </label>
                  <Input
                    type="time"
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="observations" className="block text-sm font-medium mb-2">
                  Observações
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observações sobre o agendamento..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Atualizando...' : 'Atualizar Agendamento'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

interface Cliente {
  id: string
  name: string
  email: string
}

interface Profissional {
  id: string
  name: string
  specialty: string
}

interface Procedimento {
  id: string
  name: string
  price: number
  duration: number
}

export default function NovoAgendamento() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  const [formData, setFormData] = useState({
    clientId: '',
    professionalId: '',
    procedureId: '',
    dateTime: '',
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, profissionaisRes, procedimentosRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/professionals'),
          fetch('/api/procedures')
        ])

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json()
          setClientes(clientesData)
        }

        if (profissionaisRes.ok) {
          const profissionaisData = await profissionaisRes.json()
          setProfissionais(profissionaisData)
        }

        if (procedimentosRes.ok) {
          const procedimentosData = await procedimentosRes.json()
          setProcedimentos(procedimentosData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  console.log('Clientes:', clientes)
  console.log('Profissionais:', profissionais)
  console.log('Procedimentos:', procedimentos)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('Dados do formulário:', formData)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        router.refresh()
        router.push('/admin/appointments')
      } else {
        const error = await response.json()
        console.error('Erro da API:', error)
        alert(`Erro: ${error.error || error.message}`)
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao criar agendamento')
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
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Novo Agendamento</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>Carregando dados...</p>
          </CardContent>
        </Card>
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Novo Agendamento</h1>
            <p className="text-gray-600">Cadastre um novo agendamento no sistema</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-xl font-semibold text-gray-800">Informações do Agendamento</CardTitle>
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
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} - {cliente.email}
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
                {profissionais.map((profissional) => (
                  <option key={profissional.id} value={profissional.id}>
                    {profissional.name} - {profissional.specialty}
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
                {procedimentos.map((procedimento) => (
                  <option key={procedimento.id} value={procedimento.id}>
                    {procedimento.name} - R$ {Number(procedimento.price).toFixed(2)} ({procedimento.duration}min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium mb-2">
                Data e Hora *
              </label>
              <Input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o agendamento..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? 'Salvando...' : 'Salvar Agendamento'}
              </Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
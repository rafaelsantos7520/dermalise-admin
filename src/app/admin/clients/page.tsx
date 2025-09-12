'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Mail, Phone, User } from 'lucide-react'
import { ClienteType } from '@/types'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchClientes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/clients')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes')
      }
      
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar clientes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando clientes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Clientes</h1>
            <p className="text-gray-600 mt-2">Gerencie sua base de clientes</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/clients/new')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg flex flex-row items-center justify-between">
            <CardTitle className="text-white">Lista de Clientes ({clientes.length})</CardTitle>
            <Button 
              variant="outline" 
              onClick={fetchClientes}
              disabled={isLoading}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
            >
              Atualizar
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {clientes.length === 0 ? (
              <div className="text-center py-16">
                <User className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl mb-2">Nenhum cliente cadastrado ainda</p>
                <p className="text-gray-400">Comece adicionando seu primeiro cliente!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{cliente.name}</h3>
                            {cliente.age && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">({cliente.age} anos)</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            cliente.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {cliente.gender === 'M' ? 'Masculino' : 'Feminino'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{cliente.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{cliente.phone}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
                          Cadastrado em: {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/clients/${cliente.id}/edit`)}
                          className="bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => router.push(`/admin/appointments/new?clientId=${cliente.id}`)}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Agendar
                        </Button>
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
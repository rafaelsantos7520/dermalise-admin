'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, DollarSign, FileText } from 'lucide-react'

interface Procedure {
  id: string
  name: string
  description: string
  duration: number
  price: number
  active: boolean
  createdAt: string
}

export default function ProcedimentosPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchProcedures = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/procedures')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar procedimentos')
      }
      
      const data = await response.json()
      setProcedures(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar procedimentos')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProcedureStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/procedures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !currentStatus
        }),
      })

      if (response.ok) {
        await fetchProcedures() // Recarrega a lista
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error || error.message}`)
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do procedimento')
    }
  }

  useEffect(() => {
    fetchProcedures()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Carregando procedimentos...</div>
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
              Procedimentos
            </h1>
            <p className="text-gray-600">Gerencie os procedimentos oferecidos</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/procedures/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Procedimento
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
              Lista de Procedimentos ({procedures.length})
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={fetchProcedures}
              disabled={isLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            >
              Atualizar
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {procedures.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum procedimento cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro procedimento para oferecer aos clientes.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {procedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{procedure.name}</h3>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                              procedure.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {procedure.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                        
                        {procedure.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{procedure.description}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 font-medium">{procedure.duration} min</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 font-medium">R$ {Number(procedure.price).toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-md inline-block">
                          Cadastrado em: {new Date(procedure.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/procedures/${procedure.id}/edit`)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant={procedure.active ? "destructive" : "default"} 
                          size="sm"
                          onClick={() => toggleProcedureStatus(procedure.id, procedure.active)}
                          className={procedure.active ? "" : "bg-blue-600 hover:bg-blue-700 text-white"}
                        >
                          {procedure.active ? 'Desativar' : 'Ativar'}
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
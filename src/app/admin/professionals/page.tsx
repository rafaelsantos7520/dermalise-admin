'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Mail, Phone, User, Badge } from 'lucide-react'
import { ProfissionalType } from '@/types'

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<ProfissionalType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchProfissionais = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/professionals')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar profissionais')
      }
      
      const data = await response.json()
      setProfissionais(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar profissionais')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfissionais()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Carregando profissionais...</div>
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
              Profissionais
            </h1>
            <p className="text-gray-600">Gerencie sua equipe de profissionais</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/professionals/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Profissional
          </Button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-gray-900 text-xl font-semibold">Lista de Profissionais ({profissionais.length})</CardTitle>
            <Button 
              variant="outline" 
              onClick={fetchProfissionais}
              disabled={isLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
            >
              Atualizar
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {profissionais.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  Nenhum profissional cadastrado ainda.
                </p>
                <p className="text-gray-500 text-sm">
                  Comece adicionando seu primeiro profissional à equipe!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {profissionais.map((profissional) => (
                  <div
                    key={profissional.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900">{profissional.name}</h3>
                            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mt-1 ${
                              profissional.active 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {profissional.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                        
                        {profissional.specialty && (
                          <div className="flex items-center gap-3">
                            <Badge className="h-4 w-4 text-blue-500" />
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                              {profissional.specialty}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{profissional.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{profissional.phone}</span>
                        </div>
                        
                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                          Cadastrado em: {new Date(profissional.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push(`/admin/professionals/${profissional.id}/edit`)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant={profissional.active ? "destructive" : "default"} 
                          size="sm"
                          className={profissional.active ? "" : "bg-blue-600 hover:bg-blue-700 text-white"}
                        >
                          {profissional.active ? 'Desativar' : 'Ativar'}
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
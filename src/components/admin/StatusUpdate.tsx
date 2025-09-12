'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Check, X, Clock, Play, CheckCircle } from 'lucide-react'

interface StatusUpdateProps {
  appointmentId: string
  currentStatus: string
  onStatusUpdate: (newStatus: string) => void
}

const statusOptions = [
  { value: 'SCHEDULED', label: 'Agendado', icon: Clock, color: 'text-blue-600' },
  { value: 'CONFIRMED', label: 'Confirmado', icon: Check, color: 'text-green-600' },
  { value: 'IN_PROGRESS', label: 'Em Andamento', icon: Play, color: 'text-yellow-600' },
  { value: 'COMPLETED', label: 'Concluído', icon: CheckCircle, color: 'text-gray-600' },
  { value: 'CANCELED', label: 'Cancelado', icon: X, color: 'text-red-600' },
  { value: 'NO_SHOW', label: 'Não Compareceu', icon: X, color: 'text-orange-600' }
]

export default function StatusUpdate({ appointmentId, currentStatus, onStatusUpdate }: StatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onStatusUpdate(newStatus)
      } else {
        const error = await response.json()
        alert(`Erro ao atualizar status: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do agendamento')
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus)
  const CurrentIcon = currentStatusOption?.icon || Clock

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating}
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <CurrentIcon className="h-4 w-4" />
          {isUpdating ? 'Atualizando...' : 'Status'}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {statusOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`flex items-center gap-2 cursor-pointer ${
                option.value === currentStatus ? 'bg-blue-50' : ''
              }`}
            >
              <Icon className={`h-4 w-4 ${option.color}`} />
              <span>{option.label}</span>
              {option.value === currentStatus && (
                <Check className="h-4 w-4 ml-auto text-blue-600" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

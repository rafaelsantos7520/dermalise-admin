// Função para converter status do banco (inglês) para exibição (português)
export function getStatusLabel(status: string): string {
  const statusMap: { [key: string]: string } = {
    'SCHEDULED': 'Agendado',
    'CONFIRMED': 'Confirmado', 
    'IN_PROGRESS': 'Em Andamento',
    'COMPLETED': 'Concluído',
    'CANCELED': 'Cancelado',
    'NO_SHOW': 'Não Compareceu'
  }
  
  return statusMap[status] || status
}

// Função para obter a cor do status
export function getStatusColor(status: string): string {
  const colorMap: { [key: string]: string } = {
    'SCHEDULED': 'bg-blue-100 text-blue-800',
    'CONFIRMED': 'bg-green-100 text-green-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800', 
    'COMPLETED': 'bg-gray-100 text-gray-800',
    'CANCELED': 'bg-red-100 text-red-800',
    'NO_SHOW': 'bg-orange-100 text-orange-800'
  }
  
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

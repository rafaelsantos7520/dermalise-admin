import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const [agendamentosHoje, totalClientes, totalProfissionais, totalProcedimentos] = await Promise.all([
      prisma.appointment.count({
        where: {
          dateTime: {
            gte: hoje,
            lt: amanha
          }
        }
      }),
      prisma.client.count(),
      prisma.professional.count({ where: { active: true } }),
      prisma.procedure.count({ where: { active: true } })
    ])

    return NextResponse.json({
      agendamentosHoje,
      totalClientes,
      totalProfissionais,
      totalProcedimentos
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
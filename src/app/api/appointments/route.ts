import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const hoje = searchParams.get('hoje')
    
    let whereClause = {}
    
    if (hoje === 'true') {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      
      whereClause = {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: true,
        professional: true,
        procedure: true
      },
      orderBy: {
        dateTime: hoje === 'true' ? 'asc' : 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Dados recebidos:', body)
    
    const { clientId, professionalId, procedureId, dateTime, notes } = body

    // Validações básicas
    if (!clientId || !professionalId || !procedureId || !dateTime) {
      console.log('Validação falhou:', { clientId, professionalId, procedureId, dateTime })
      return NextResponse.json(
        { error: 'Cliente, profissional, procedimento e data/hora são obrigatórios' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        professionalId,
        procedureId,
        dateTime: new Date(dateTime),
        notes: notes || null
      },
      include: {
        client: true,
        professional: true,
        procedure: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
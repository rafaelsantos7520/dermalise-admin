import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar agendamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
      where: {
        id
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        professional: {
          select: {
            id: true,
            name: true
          }
        },
        procedure: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Formatar a resposta
    const formattedAppointment = {
      id: appointment.id,
      clientId: appointment.clientId,
      clientName: appointment.client?.name,
      professionalId: appointment.professionalId,
      professionalName: appointment.professional?.name,
      procedureId: appointment.procedureId,
      procedureName: appointment.procedure?.name,
      appointmentDate: appointment.dateTime,
      status: appointment.status,
      observations: appointment.notes,
      createdAt: appointment.createdAt
    }

    return NextResponse.json(formattedAppointment)
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar agendamento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { clientId, professionalId, procedureId, appointmentDate, status, observations } = body

    // Validações básicas
    if (!clientId || !professionalId || !procedureId || !appointmentDate) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Verificar se o agendamento existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 400 }
      )
    }

    // Verificar se o profissional existe e está ativo
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId }
    })

    if (!professional || !professional.active) {
      return NextResponse.json(
        { error: 'Profissional não encontrado ou inativo' },
        { status: 400 }
      )
    }

    // Verificar se o procedimento existe e está ativo
    const procedure = await prisma.procedure.findUnique({
      where: { id: procedureId }
    })

    if (!procedure || !procedure.active) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado ou inativo' },
        { status: 400 }
      )
    }

    // Verificar conflito de horário (exceto com o próprio agendamento)
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        dateTime: new Date(appointmentDate),
        id: { not: id },
        status: {
          not: 'CANCELED'
        }
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Já existe um agendamento para este profissional neste horário' },
        { status: 400 }
      )
    }

    // Atualizar o agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        clientId,
        professionalId,
        procedureId,
        dateTime: new Date(appointmentDate),
        status: status || 'SCHEDULED',
        notes: observations?.trim() || null
      },
      include: {
        client: {
          select: {
            name: true
          }
        },
        professional: {
          select: {
            name: true
          }
        },
        procedure: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover agendamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verificar se o agendamento existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o agendamento
    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Agendamento removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

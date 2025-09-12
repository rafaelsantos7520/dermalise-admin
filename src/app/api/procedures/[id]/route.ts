import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar procedimento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const procedure = await prisma.procedure.findUnique({
      where: {
        id
      }
    })

    if (!procedure) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(procedure)
  } catch (error) {
    console.error('Erro ao buscar procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar procedimento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, duration, price, active } = body

    // Validações básicas
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { error: 'Duração deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (!price || price < 0) {
      return NextResponse.json(
        { error: 'Preço deve ser maior ou igual a zero' },
        { status: 400 }
      )
    }

    // Verificar se o procedimento existe
    const existingProcedure = await prisma.procedure.findUnique({
      where: { id: id }
    })

    if (!existingProcedure) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe outro procedimento com o mesmo nome
    const duplicateName = await prisma.procedure.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    })

    if (duplicateName) {
      return NextResponse.json(
        { error: 'Já existe um procedimento com este nome' },
        { status: 400 }
      )
    }

    // Atualizar o procedimento
    const updatedProcedure = await prisma.procedure.update({
      where: { id: id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        active: Boolean(active)
      }
    })

    return NextResponse.json(updatedProcedure)
  } catch (error) {
    console.error('Erro ao atualizar procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover procedimento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verificar se o procedimento existe
    const existingProcedure = await prisma.procedure.findUnique({
      where: { id },
      include: {
        appointments: true
      }
    })

    if (!existingProcedure) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há agendamentos vinculados
    if (existingProcedure.appointments && existingProcedure.appointments.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir procedimento com agendamentos vinculados' },
        { status: 400 }
      )
    }

    // Deletar o procedimento
    await prisma.procedure.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Procedimento removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

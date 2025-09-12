import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const professional = await prisma.professional.findUnique({
      where: {
        id: id
      }
    })

    if (!professional) {
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error('Erro ao buscar profissional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { name, email, phone, specialty, active } = await request.json()

    // Validações básicas
    if (!name || !email || !phone || !specialty) {
      return NextResponse.json(
        { error: 'Nome, email, telefone e especialidade são obrigatórios' },
        { status: 400 }
      )
    }

    const updatedProfessional = await prisma.professional.update({
      where: {
        id: id
      },
      data: {
        name,
        email,
        phone,
        specialty,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json(updatedProfessional)
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    await prisma.professional.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Profissional excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir profissional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

  const professionals = await prisma.professional.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

  return NextResponse.json(professionals)
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
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

  const { name, email, phone, specialty, active } = await request.json()

    // Validações básicas
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email and phone are required' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingProfessional = await prisma.professional.findUnique({
      where: { email }
    })

    if (existingProfessional) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const professional = await prisma.professional.create({
      data: {
        name,
        email,
        phone,
        specialty: specialty || null,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json(professional, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar profissional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
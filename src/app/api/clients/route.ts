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

  const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

  return NextResponse.json(clients)
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
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

  const { name, age, gender, email, phone } = await request.json()

    // Validações básicas
    if (!name || !gender || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, gender, email and phone are required' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
  const existingClient = await prisma.client.findUnique({
      where: { email }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

  const client = await prisma.client.create({
      data: {
        name,
        age: age ? parseInt(age) : null,
        gender,
        email,
        phone
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
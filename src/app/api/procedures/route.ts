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

    const procedures = await prisma.procedure.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(procedures)
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
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

  const { name, description, duration, price, active } = await request.json()

    // Validações básicas
    if (!name || !duration || !price) {
      return NextResponse.json(
        { error: 'Name, duration and price are required' },
        { status: 400 }
      )
    }

    const procedure = await prisma.procedure.create({
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json(procedure, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar admin inicial
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@dermilise.com' },
    update: {},
    create: {
      email: 'admin@dermilise.com',
      password: hashedPassword,
      nome: 'Administrador'
    }
  })

  console.log('Admin criado:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
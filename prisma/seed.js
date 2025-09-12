const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Criar admin inicial
  const hashedPassword = await bcrypt.hash('84498927', 12);

  const admin = await prisma.admin.upsert({
    where: { email: 'rafael@dermilise.com' },
    update: {},
    create: {
      email: 'rafael@dermilise.com',
      password: hashedPassword,
      name: 'Administrador'
    }
  });

  console.log('Admin criado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

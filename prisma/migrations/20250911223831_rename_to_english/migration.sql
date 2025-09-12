/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agendamentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedimentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profissionais` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "dermalise_admin"."AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- DropForeignKey
ALTER TABLE "dermalise_admin"."agendamentos" DROP CONSTRAINT "agendamentos_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "dermalise_admin"."agendamentos" DROP CONSTRAINT "agendamentos_procedimentoId_fkey";

-- DropForeignKey
ALTER TABLE "dermalise_admin"."agendamentos" DROP CONSTRAINT "agendamentos_profissionalId_fkey";

-- DropTable
DROP TABLE "dermalise_admin"."admins";

-- DropTable
DROP TABLE "dermalise_admin"."agendamentos";

-- DropTable
DROP TABLE "dermalise_admin"."clientes";

-- DropTable
DROP TABLE "dermalise_admin"."procedimentos";

-- DropTable
DROP TABLE "dermalise_admin"."profissionais";

-- DropEnum
DROP TYPE "dermalise_admin"."StatusAgendamento";

-- CreateTable
CREATE TABLE "dermalise_admin"."admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dermalise_admin"."client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dermalise_admin"."professional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialty" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dermalise_admin"."procedure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dermalise_admin"."appointment" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "status" "dermalise_admin"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "dermalise_admin"."admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "dermalise_admin"."client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "professional_email_key" ON "dermalise_admin"."professional"("email");

-- AddForeignKey
ALTER TABLE "dermalise_admin"."appointment" ADD CONSTRAINT "appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "dermalise_admin"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dermalise_admin"."appointment" ADD CONSTRAINT "appointment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "dermalise_admin"."professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dermalise_admin"."appointment" ADD CONSTRAINT "appointment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "dermalise_admin"."procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

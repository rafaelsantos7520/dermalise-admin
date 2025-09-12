import { Admin, Client, Professional, Procedure, Appointment } from '@prisma/client'

export type AdminType = Admin
export type ClienteType = Client
export type ProfissionalType = Professional
export type ProcedimentoType = Procedure
export type AgendamentoType = Appointment

export type AgendamentoCompleto = Appointment & {
  client: Client
  professional: Professional
  procedure: Procedure
}
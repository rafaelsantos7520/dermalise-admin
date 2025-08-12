import { Admin, Cliente, Profissional, Procedimento, Agendamento } from '@prisma/client'

export type AdminType = Admin
export type ClienteType = Cliente
export type ProfissionalType = Profissional
export type ProcedimentoType = Procedimento
export type AgendamentoType = Agendamento

export type AgendamentoCompleto = Agendamento & {
  cliente: Cliente
  profissional: Profissional
  procedimento: Procedimento
}
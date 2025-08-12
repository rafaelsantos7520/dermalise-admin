import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Proteger apenas rotas específicas do admin (excluindo login)
    '/admin/dashboard/:path*',
    '/admin/clientes/:path*',
    '/admin/profissionais/:path*',
    '/admin/procedimentos/:path*',
    '/admin/agendamentos/:path*',
    // Excluir arquivos estáticos e API routes
    '/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)',
  ]
}
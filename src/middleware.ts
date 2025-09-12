import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
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
    '/admin/dashboard/:path*',
    '/admin/clients/:path*',
    '/admin/professionals/:path*',
    '/admin/procedures/:path*',
    '/admin/appointments/:path*'
  ]
}
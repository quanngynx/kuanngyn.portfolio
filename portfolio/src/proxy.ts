import createMiddleware from 'next-intl/middleware'
import { routing } from './common/i18n/routes'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

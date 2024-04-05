import { NextResponse } from 'next/server'
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/api/webhook'],
  afterAuth(auth, req) {
    if (!!auth.userId && auth.isPublicRoute) {
      const path = !!auth.orgId ? `/organization/${auth.orgId}` : '/select-org'
      const orgSelection = new URL(path, req.url)
      return NextResponse.redirect(orgSelection)
    }
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: '/' })
    }
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org') {
      const orgSelection = new URL('/select-org', req.url)
      return NextResponse.redirect(orgSelection)
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}

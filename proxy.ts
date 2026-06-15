import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { COOKIE } from '@/lib/auth'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

async function getUser(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const user = await getUser(request)

  if ((path.startsWith('/dashboard') || path.startsWith('/loja') || path.startsWith('/produtos')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    if (user.role !== 'admin') return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/loja/:path*', '/produtos/:path*', '/admin/:path*', '/login'],
}

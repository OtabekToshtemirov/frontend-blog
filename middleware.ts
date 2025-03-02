import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LANGUAGES, type Language } from '@/lib/constants'

const locales = Object.keys(LANGUAGES) as Language[]
const defaultLocale: Language = 'uz'

function getLocaleFromHeader(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language')
  
  if (!acceptLanguage) return defaultLocale
  
  const preferredLocale = acceptLanguage
    .split(',')[0]
    .trim()
    .split('-')[0]
    .toLowerCase()
  
  return locales.includes(preferredLocale as Language) 
    ? preferredLocale as Language 
    : defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Special handling for root path
  if (pathname === '/') {
    const locale = getLocaleFromHeader(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Exclude files and api routes
  if (
    pathname.includes('.') || // files
    pathname.startsWith('/api/') || // api routes
    pathname.startsWith('/_next/') || // next.js internal
    pathname.startsWith('/static/') // static files
  ) {
    return
  }

  // Get the pathname segments
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  // Check if the first segment is a supported locale
  const isLocaleSet = locales.includes(firstSegment as Language)

  // If locale is already set, do nothing
  if (isLocaleSet) {
    return NextResponse.next()
  }

  // If no locale is set, redirect to the preferred locale
  const locale = getLocaleFromHeader(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Match all paths except api, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Match root path /
    '/'
  ],
}
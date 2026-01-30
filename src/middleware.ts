import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /consulta (without locale prefix) should go to Spanish version
  if (pathname === '/consulta') {
    const url = request.nextUrl.clone();
    url.pathname = '/es/consulta';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|es)/:path*', '/screening', '/privacy', '/terms', '/data-deletion', '/consult', '/consulta']
};

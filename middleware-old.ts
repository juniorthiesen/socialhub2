import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('instagram_token')?.value;
  const userId = request.cookies.get('instagram_user_id')?.value;

  if (request.nextUrl.pathname === '/settings') {
    return NextResponse.next();
  }

  if (!token || !userId) {
    return NextResponse.redirect(new URL('/settings', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

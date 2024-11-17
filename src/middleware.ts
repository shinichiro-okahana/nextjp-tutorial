import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/zipcodes', '/customers'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const response = await fetch(new URL('/api/users/verify', request.url), {
      method: 'GET',
      headers: {
        'Cookie': `token=${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/zipcodes', '/zipcodes/:path*', '/customers', '/customers/:path*'],
};

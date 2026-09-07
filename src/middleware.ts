import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === 'padres' && pwd === 'BabyShower2024') {
      return NextResponse.next();
    }
  }
  
  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Panel de Padres"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};

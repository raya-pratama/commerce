import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Jika mencoba masuk halaman admin tapi belum login
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi malah mau ke halaman login lagi
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/products', request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware ini untuk halaman admin dan login
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
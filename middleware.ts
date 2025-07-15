import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";





const publicPaths = ['/login', '/forgot-password', '/api']

const authRedirectPaths = ['/', '/login', '/forgot-password']

export function middleware(request: NextRequest) {

 const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl





  if (token && authRedirectPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/class", request.url));
  }


  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }


  if (!token && !publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
 
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
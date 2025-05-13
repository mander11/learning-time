import { auth } from "@/app/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type AuthenticatedRequest = NextRequest & {
  auth: {
    user?: {
      name?: string;
      email?: string;
      image?: string;
    } | null;
  } | null;
};
 
export default auth((req: AuthenticatedRequest) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth?.user;
  
  // Protect the /protected route
  if (nextUrl.pathname.startsWith("/protected")) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    
    // Redirect to login if not logged in
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
})
 
// Export the config for Next.js Edge middleware
export const config = {
  matcher: ["/protected/:path*"],
};

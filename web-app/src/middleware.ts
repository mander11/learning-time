import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

// Simple middleware that only protects the /protected routes
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  
  // Only protect the /protected routes
  if (nextUrl.pathname.startsWith("/protected")) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    
    // Redirect to login if not logged in
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }
  
  // Allow all other routes to pass through
  return NextResponse.next();
})
 
// Export the config for Next.js Edge middleware
export const config = {
  matcher: ["/protected/:path*"],
};

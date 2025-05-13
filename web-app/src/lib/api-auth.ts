import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface UserSession {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

/**
 * Gets the list of allowed emails from environment variables
 */
export function getAllowedEmails(): string[] {
  const allowedEmailsEnv = process.env.ALLOWED_EMAILS || '';
  return allowedEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

/**
 * Extract user session from the request cookies
 */
export async function getSessionFromCookies(req: NextRequest): Promise<UserSession | null> {
  try {
    // Get the session token from cookies
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value;
    
    if (!sessionToken) return null;
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode(sessionToken) as any;
    
    if (!decoded) return null;
    
    return {
      user: {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture
      }
    };
  } catch (error) {
    console.error('Error getting session from cookies:', error);
    return null;
  }
}

/**
 * Higher-order function to protect API routes with email-based authorization
 * @param handler The API route handler function
 */
export function withApiAuth(
  handler: (req: NextRequest, session: UserSession) => Promise<NextResponse> | NextResponse
) {
  return async function (req: NextRequest) {
    // Get session from cookies
    const session = await getSessionFromCookies(req);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }
    
    // Check if user's email is in the allowed list
    const userEmail = session.user.email;
    const allowedEmails = getAllowedEmails();
    
    if (allowedEmails.length > 0 && userEmail && !allowedEmails.includes(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to access this API" },
        { status: 403 }
      );
    }
    
    // If checks pass, call the original handler
    return handler(req, session);
  };
}

// Force a Node runtime (gRPC doesn't run in the Edge runtime)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { Firestore } from '@google-cloud/firestore';

// Initialize with env-based credentials
const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// Helper function to get allowed emails from environment variable
function getAllowedEmails(): string[] {
  const allowedEmailsEnv = process.env.ALLOWED_EMAILS || '';
  return allowedEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

// GET /api/firestore → returns first 10 docs from the "items" collection
export async function GET(req: NextRequest) {
  // Check authentication and authorization
  const session = await getServerSession();
  
  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }
  
  // Check if user's email is in the allowed list
  const allowedEmails = getAllowedEmails();
  if (allowedEmails.length > 0 && !allowedEmails.includes(session.user.email as string)) {
    return NextResponse.json({ error: 'Forbidden: You don\'t have permission to access this API' }, { status: 403 });
  }
  
  try {
    const snap = await db.collection('items').limit(10).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Adding user info to help with debugging
    const result = {
      data,
      user: {
        name: session.user.name,
        email: session.user.email,
      }
    };
    
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('Error fetching data from Firestore:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

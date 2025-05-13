// Force a Node runtime (gRPC doesn't run in the Edge runtime)
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

// Initialize with env-based credentials
const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// GET /api/firestore → returns first 10 docs from the "items" collection
export async function GET(_req: NextRequest) {
  try {
    const snap = await db.collection('items').limit(10).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error('Error fetching data from Firestore:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

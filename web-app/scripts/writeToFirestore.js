const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

// Initialize Firestore with env-based credentials
const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

async function writeDocument(collectionName, data) {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log(`Document written with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error writing document:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const sampleData = {
    name: 'Test Item',
    description: 'This is a test item',
    createdAt: new Date(),
  };

  try {
    await writeDocument('items', sampleData);
    console.log('Successfully wrote document to Firestore');
  } catch (error) {
    console.error('Failed to write document:', error);
  }
}

// Run the script
if (require.main === module) {
  main().then(() => process.exit(0));
}

module.exports = { writeDocument };

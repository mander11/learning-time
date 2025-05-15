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

async function main() {
  try {
    // Query to get all documents where course is "Whizlabs Practice Test"
    const querySnapshot = await db.collection('questions')
      .where('course', '==', 'Whizlabs Practice Test')
      .get();

    console.log(`Found ${querySnapshot.size} documents with course "Whizlabs Practice Test"`);

    console.log('Starting deletion...');
    const batch = db.batch();
    
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Successfully deleted all matching documents');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

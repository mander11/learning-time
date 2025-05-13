const { Firestore, FieldValue } = require('@google-cloud/firestore');
require('dotenv').config();

// Initialize Firestore with env-based credentials
const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

async function writeQuestion(questionData) {
  try {
    // Ensure required fields are present
    const requiredFields = ['path', 'course', 'courseOrder', 'module', 'moduleOrder', 'question', 'answers'];
    for (const field of requiredFields) {
      if (!questionData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Add timestamps
    const enrichedData = {
      ...questionData,
      status: questionData.status || 'pending',
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('questions').add(enrichedData);
    console.log('New question ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error writing question:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const sampleQuestion = {
    path: 'GCP Professional Data Engineer',
    course: '02 – Preparing for your Professional Data Engineer Journey',
    courseOrder: 2,
    module: 'Storing Data',
    moduleOrder: 3,
    question: 'Your analysts repeatedly run the same complex queries...',
    answers: {
      A: 'Export the frequently queried data into a new table.',
      B: 'Create a dataset with the data that is frequently queried.',
      C: 'Create a view of the frequently queried data.',
      D: 'Export the frequently queried data into Cloud SQL.'
    },
    status: 'completed'
  };

  try {
    await writeQuestion(sampleQuestion);
    console.log('Successfully wrote question to Firestore');
  } catch (error) {
    console.error('Failed to write question:', error);
  }
}

// Run the script
if (require.main === module) {
  main().then(() => process.exit(0));
}

module.exports = { writeQuestion };

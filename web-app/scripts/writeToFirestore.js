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
  const questions = [
    {
      path: 'GCP Professional Data Engineer',
      course: '02 – Preparing for your Professional Data Engineer Journey',
      courseOrder: 2,
      module: 'Maintaining and Automating Data Workloads',
      moduleOrder: 5,
      question: 'You are running a Dataflow pipeline in production. The input data for this pipeline is occasionally inconsistent. Separately from processing the valid data, you want to efficiently capture the erroneous input data for analysis. What should you do?',
      answers: {
        A: 'Create a side output for the erroneous data.',
        B: 'Re-read the input data and create separate outputs for valid and erroneous data.',
        C: 'Check for the erroneous data in the logs.',
        D: 'Read the data once, and split it into two pipelines, one to output valid data and another to output erroneous data.'
      },
      status: 'pending'
    },
    {
      path: 'GCP Professional Data Engineer',
      course: '02 – Preparing for your Professional Data Engineer Journey',
      courseOrder: 2,
      module: 'Maintaining and Automating Data Workloads',
      moduleOrder: 5,
      question: 'You run a Cloud SQL instance for a business that requires that the database is accessible for transactions. You need to ensure minimal downtime for database transactions. What should you do?',
      answers: {
        A: 'Configure replication.',
        B: 'Configure backups and increase the number of backups.',
        C: 'Configure high availability.',
        D: 'Configure backups.'
      },
      status: 'pending'
    }
  ];

  try {
    for (const question of questions) {
      await writeQuestion(question);
      console.log('Successfully wrote question to Firestore');
    }
  } catch (error) {
    console.error('Failed to write question:', error);
  }
}

// Run the script
if (require.main === module) {
  main().then(() => process.exit(0));
}

module.exports = { writeQuestion };

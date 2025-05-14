const { Firestore, FieldValue } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Firestore with env-based credentials
const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// Function to read questions from a JSON file
function loadQuestionsFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading questions from ${filePath}:`, error);
    throw error;
  }
}

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
      // Preserve questionOrder if it exists
      questionOrder: questionData.questionOrder !== undefined ? questionData.questionOrder : null,
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

// Main function that accepts a file path as an argument
async function main() {
  // Default to questions.json in the same directory if no file is specified
  const questionFile = process.argv[2] || path.join(__dirname, 'questions.json');
  
  console.log(`Loading questions from: ${questionFile}`);
  
  try {
    const questions = loadQuestionsFromFile(questionFile);
    console.log(`Found ${questions.length} questions to import`);
    
    for (const question of questions) {
      await writeQuestion(question);
      console.log(`Successfully wrote question: "${question.question.substring(0, 50)}..."`);
    }
    
    console.log('All questions written to Firestore successfully');
  } catch (error) {
    console.error('Failed to write questions:', error);
  }
}

// Run the script
if (require.main === module) {
  main().then(() => process.exit(0));
}

module.exports = { writeQuestion, loadQuestionsFromFile };

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  path: string;
  course: string;
  courseOrder: number;
  module: string;
  moduleOrder: number;
  question: string;
  answers: {
    [key: string]: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function TestQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuestions(data.questions || []);
        }
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="p-4">Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const handleAnswerSelect = (key: string) => {
    setSelectedAnswer(key);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Home
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{currentQuestion.course}</h1>
        <p className="text-gray-600">{currentQuestion.module}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {Object.entries(currentQuestion.answers).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                className={`w-full text-left p-4 rounded-lg border ${
                  selectedAnswer === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{key}.</span> {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded ${
            currentIndex === 0
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className={`px-4 py-2 rounded ${
            currentIndex === questions.length - 1
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

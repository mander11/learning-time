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
  const [showCopied, setShowCopied] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

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

  const handleCopyQuestion = () => {
    const answerText = Object.entries(currentQuestion.answers)
      .map(([key, value]) => `${key}. ${value}`)
      .join('\n');
    
    const textToCopy = `${currentQuestion.question}\n\nWhich option is right? Please explain why others are wrong.\n\n${answerText}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text:', err));
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
      <div className="mb-4">
        <button
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          className="flex items-center text-xs text-gray-500 hover:text-gray-700 mb-2"
        >
          <svg
            className={`w-4 h-4 mr-1 transform transition-transform ${isInfoExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Course Info
        </button>
        
        {isInfoExpanded && (
          <div className="pl-5 mb-4 text-sm">
            <p className="font-medium text-gray-700">{currentQuestion.course}</p>
            <p className="text-gray-500">{currentQuestion.module}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          {showCopied && (
            <span className="mr-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md">
              Copied!
            </span>
          )}
          <button
            onClick={handleCopyQuestion}
            className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy question"
          >
            <svg
              className="w-6 h-6 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl mb-2">{currentQuestion.question}</h2>
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

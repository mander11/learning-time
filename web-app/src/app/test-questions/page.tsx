'use client';

import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Test Page</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(questions, null, 2)}
      </pre>
    </div>
  );
}

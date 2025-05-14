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
  guess?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function QuestionSummary() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    path: '',
    course: '',
    module: '',
    showWithGuesses: false,
  });
  
  // Get unique values for filter dropdowns
  const uniquePaths = Array.from(new Set(questions.map(q => q.path))).sort();
  const uniqueCourses = Array.from(new Set(questions.map(q => q.course))).sort();
  const uniqueModules = Array.from(new Set(questions.map(q => q.module))).sort();

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

  useEffect(() => {
    let filtered = [...questions];

    if (filters.path) {
      filtered = filtered.filter(q => q.path === filters.path);
    }
    if (filters.course) {
      filtered = filtered.filter(q => q.course === filters.course);
    }
    if (filters.module) {
      filtered = filtered.filter(q => q.module === filters.module);
    }
    if (!filters.showWithGuesses) {
      filtered = filtered.filter(q => !q.guess);
    }

    setFilteredQuestions(filtered);
  }, [questions, filters]);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Question Summary</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Path
            </label>
            <select
              value={filters.path}
              onChange={(e) => setFilters(prev => ({ ...prev, path: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">All Paths</option>
              {uniquePaths.map(path => (
                <option key={path} value={path}>{path}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module
            </label>
            <select
              value={filters.module}
              onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">All Modules</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showWithGuesses}
                onChange={(e) => setFilters(prev => ({ ...prev, showWithGuesses: e.target.checked }))}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Show questions with guesses</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Path: {question.path}</p>
                  <p className="text-sm text-gray-500">Course: {question.course}</p>
                  <p className="text-sm text-gray-500">Module: {question.module}</p>
                </div>
                <Link
                  href={`/test-questions?id=${question.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Practice
                </Link>
              </div>
              <p className="text-gray-800">{question.question}</p>
              {question.guess && (
                <p className="mt-2 text-sm text-green-600">
                  Previous answer: {question.guess}
                </p>
              )}
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No questions match the selected filters
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-600">
        {filteredQuestions.length} questions shown
      </div>
    </div>
  );
}

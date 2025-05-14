'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Question } from '@/types/question';

export default function TestQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [visibleAnswerCount, setVisibleAnswerCount] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [filters, setFilters] = useState({
    path: '',
    course: '',
    module: '',
    includeGuessed: false,
  });

  // Get unique values for filter dropdowns
  const uniquePaths = Array.from(new Set(questions.map(q => q.path))).sort();
  const uniqueCourses = Array.from(new Set(questions.map(q => q.course))).sort();
  const uniqueModules = Array.from(new Set(questions.map(q => q.module))).sort();

  const WORDS_PER_TAP = 4;

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuestions(data.questions || []);
          // Initially filter to show only unguessed questions
          const unguessedQuestions = (data.questions || []).filter((q: Question) => !q.guess);
          setFilteredQuestions(unguessedQuestions);
        }
      })
      .catch(err => setError(err.message));
  }, []);

  // Apply filters when questions or filters change
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
    if (!filters.includeGuessed) {
      filtered = filtered.filter(q => !q.guess);
    }

    setFilteredQuestions(filtered);
    // Reset to first question when filters change
    setCurrentIndex(0);
    setVisibleCount(0);
    setVisibleAnswerCount(0);
    setSelectedAnswer(null);
  }, [questions, filters]);

  // Reset counts when question changes and set any saved guess
  useEffect(() => {
    setVisibleCount(0);
    setVisibleAnswerCount(0);
    setCanUndo(false);
    
    // If there's a saved guess for this question, show it
    const savedGuess = filteredQuestions[currentIndex]?.guess;
    setSelectedAnswer(savedGuess || null);
    if (savedGuess) {
      setVisibleAnswerCount(Object.keys(filteredQuestions[currentIndex].answers).length);
    }
  }, [currentIndex, filteredQuestions]);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="p-4">Loading questions...</div>;
  }

  const currentQuestion = filteredQuestions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Practice Questions</h1>
          
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg
              className={`w-4 h-4 mr-1 transform transition-transform ${isFiltersExpanded ? 'rotate-90' : ''}`}
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
            Filters
            {(filters.path || filters.course || filters.module || filters.includeGuessed) && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                Active
              </span>
            )}
          </button>
          
          {isFiltersExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pl-5">
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
                    checked={filters.includeGuessed}
                    onChange={(e) => setFilters(prev => ({ ...prev, includeGuessed: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Include answered questions</span>
                </label>
              </div>
            </div>
          )}

          <div className="text-center py-8 text-gray-500">
            No questions match the selected filters
          </div>
        </div>
      </div>
    );
  }

  const words = currentQuestion.question.trim().split(/\s+/);
  const startIndex = (visibleCount - 1) * WORDS_PER_TAP;
  const visibleText = words.slice(0, startIndex + WORDS_PER_TAP).join(' ');
  const done = startIndex + WORDS_PER_TAP >= words.length;

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAnswerSelect = async (key: string) => {
    setSelectedAnswer(key);
    
    try {
      const response = await fetch('/api/questions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentQuestion.id,
          guess: key,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save answer');
      }
    } catch (err) {
      console.error('Error saving answer:', err);
    }
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

  const revealMore = () => {
    if (!done) {
      setVisibleCount(c => c + 1);
      setCanUndo(true);
    } else {
      // If question is done, start revealing answers
      const totalAnswers = Object.keys(currentQuestion.answers).length;
      if (visibleAnswerCount < totalAnswers) {
        setVisibleAnswerCount(c => c + 1);
        setCanUndo(true);
      }
    }
  };

  const handleUndo = () => {
    if (visibleAnswerCount > 0) {
      setVisibleAnswerCount(c => c - 1);
    } else if (visibleCount > 0) {
      setVisibleCount(c => c - 1);
    }
    
    // Disable undo if we're back at the start
    if (visibleAnswerCount === 1 || (visibleAnswerCount === 0 && visibleCount === 1)) {
      setCanUndo(false);
    }
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

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Practice Questions</h1>
        
        <button
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg
            className={`w-4 h-4 mr-1 transform transition-transform ${isFiltersExpanded ? 'rotate-90' : ''}`}
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
          Filters
          {(filters.path || filters.course || filters.module || filters.includeGuessed) && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </button>
        
        {isFiltersExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pl-5">
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
                  checked={filters.includeGuessed}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeGuessed: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Include answered questions</span>
              </label>
            </div>
          </div>
        )}

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
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div
            onPointerUp={revealMore}
            onKeyDown={e => [' ', 'ArrowRight'].includes(e.key) && revealMore()}
            role="button"
            tabIndex={0}
            aria-label={currentQuestion.question}
            className="flex-1 cursor-pointer select-none"
          >
            <h2 className="text-xl mb-2 leading-relaxed">
              {visibleText}
              {!done && <span className="animate-pulse"> ▋</span>}
            </h2>
            {done && visibleAnswerCount < Object.keys(currentQuestion.answers).length && (
              <p className="text-sm text-gray-500 italic">
                Tap to reveal answers ({visibleAnswerCount} of {Object.keys(currentQuestion.answers).length})
              </p>
            )}
          </div>
          {canUndo && (
            <button
              onClick={handleUndo}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Undo last reveal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
          )}
        </div>

        {done && (
          <div className="space-y-3">
            {Object.entries(currentQuestion.answers)
              .slice(0, visibleAnswerCount)
              .map(([key, value]) => (
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
        )}
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
          Question {currentIndex + 1} of {filteredQuestions.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
          className={`px-4 py-2 rounded ${
            currentIndex === filteredQuestions.length - 1
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

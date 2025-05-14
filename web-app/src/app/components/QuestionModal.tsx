import { Question } from '@/types/question';

interface QuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionModal({ question, isOpen, onClose }: QuestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Content */}
          <div className="mb-6">
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-500">Path: {question.path}</p>
              <p className="text-sm text-gray-500">Course: {question.course}</p>
              <p className="text-sm text-gray-500">Module: {question.module}</p>
            </div>
            
            <h2 className="text-xl font-medium mb-4">{question.question}</h2>
            
            <div className="space-y-3">
              {Object.entries(question.answers).map(([key, value]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg border ${
                    question.guess === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <span className="font-medium">{key}.</span> {value}
                  {question.guess === key && (
                    <span className="ml-2 text-sm text-blue-600">
                      (Your answer)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <a
              href={`/test-questions?id=${question.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Practice
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

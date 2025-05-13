"use client";

import { useState } from "react";
import AuthButton from "./components/AuthButton";

// Define interface for the Firestore data
interface FirestoreData {
  items: {
    id: string;
    name: string;
    value: number;
  }[];
  timestamp: string;
}

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Learning Time App</h1>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <AuthButton />
          <FirestoreButton />
          <a
            href="/test-questions"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Start Practice Questions
          </a>
        </div>
      </main>
    </div>
  );
}

function FirestoreButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<FirestoreData | null>(null);

  const fetchFromFirestore = async () => {
    setIsLoading(true);
    try {
      // Call our API endpoint instead of directly accessing Firestore
      const response = await fetch('/api/firestore');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={fetchFromFirestore}
        disabled={isLoading}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600"
      >
        {isLoading ? 'Loading...' : 'Fetch Firestore Data'}
      </button>
      {data && (
        <div className="mt-4 p-4 bg-black/[.05] dark:bg-white/[.06] rounded">
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

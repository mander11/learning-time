"use client";

import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Learning Time App</h1>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <AuthButton />
          <a
            href="/test-questions"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Start Practice Questions
          </a>
          <a
            href="/question-summary"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Question Summary
          </a>
        </div>
      </main>
    </div>
  );
}

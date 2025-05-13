export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-black dark:text-white">
          Hello World!
        </h1>
        <p className="text-xl text-center text-gray-700 dark:text-gray-300">
          Welcome to my Next.js application deployed on Vercel
        </p>
      </main>
    </div>
  );
}

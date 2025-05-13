import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

// Server component that checks auth on the server side
export default async function ProtectedPage() {
  // Get session on the server
  const session = await getServerSession();
  
  // Redirect if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/protected");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={120}
            height={25}
            priority
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-center">Protected Content</h1>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-3 mb-4">
            {session.user?.image && (
              <Image 
                src={session.user.image} 
                alt="User profile" 
                width={40} 
                height={40} 
                className="rounded-full"
              />
            )}
            <div>
              <div className="font-semibold">{session.user?.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{session.user?.email}</div>
            </div>
          </div>
          
          <div className="text-sm mb-2 font-semibold">Session Information:</div>
          <pre className="text-xs bg-gray-200 dark:bg-gray-600 p-2 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

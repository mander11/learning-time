"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <button 
        disabled
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-gray-100 dark:bg-gray-800 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col gap-2 items-center sm:items-start">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {session.user?.image && (
            <Image 
              src={session.user.image} 
              alt="User profile" 
              width={24} 
              height={24} 
              className="rounded-full"
            />
          )}
          <span>Signed in as {session.user?.name || session.user?.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
}

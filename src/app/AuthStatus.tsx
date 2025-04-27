// components/AuthStatus.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const AuthStatus = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (session) {
    return (
      <div className="absolute top-4 right-4">
        <p className="text-sm text-gray-600">Welcome, {session.user?.name}</p>
        <button 
          onClick={() => signOut()}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Don't show sign-in button if we're on any auth-related page
  if (isAuthPage) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4">
      <button 
        onClick={() => signIn()}
        className="text-sm text-indigo-600 hover:text-indigo-800"
      >
        Sign in
    </button>
    </div>
  );
};

export default AuthStatus;

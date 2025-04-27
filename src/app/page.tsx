"use client"

import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to NextAuth Demo</h1>
        
        {session ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Hello, {session.user?.name}!</h2>
            <p className="text-gray-600">You are signed in with {session.user?.email}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Sign in to continue</h2>
            <p className="text-gray-600">Use Google or GitHub to sign in</p>
          </div>
        )}
        </div>
    </div>
  )
}

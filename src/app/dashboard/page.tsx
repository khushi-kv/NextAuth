"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">User Information</h2>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {session?.user?.name}</p>
                <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Authentication Status</h2>
              <p className="mt-2 text-green-600">You are authenticated!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
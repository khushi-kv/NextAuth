"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { RoleBasedSection } from "@/components/RoleBasedContent"
import { UserRole } from "@prisma/client"
import { Suspense } from "react"
import { useEffect } from "react"
import { toast } from 'react-toastify'
import SessionTimer from "@/components/SessionTimer"


// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )
}

// Simple error component
function ErrorMessage() {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-red-800 font-semibold">Something went wrong</h2>
      <p className="text-red-600 mt-2">Please try refreshing the page</p>
    </div>
  )
}

// Dashboard content component
function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    toast.success("Successfully logged out!")
    router.push("/auth/signin")
  }

  if (status === "loading") {
    return <LoadingState />
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <RoleBasedSection role={UserRole.ADMIN}>
        <div className="p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
          <p>Welcome to the admin dashboard. You have full access to all features.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.VENDOR}>
        <div className="p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Vendor Panel</h2>
          <p>Manage your products and view sales analytics.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.SUPPORT}>
        <div className="p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Support Panel</h2>
          <p>View customer tickets and provide support.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.USER}>
        <div className="p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">User Dashboard</h2>
          <p>View your orders and manage your account.</p>
        </div>
      </RoleBasedSection>

      <button
        onClick={handleSignOut}
        className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Sign Out
      </button>

      {/* Session Timer  to test the token refresh*/}
      {/* <SessionTimer /> */}
    </div>
  )
}

// Main dashboard page with error handling and loading state
export default function DashboardPage() {
  try {
    return (
      <Suspense fallback={<LoadingState />}>
        <DashboardContent />
      </Suspense>
    )
  } catch (error) {
    return <ErrorMessage />
  }
} 
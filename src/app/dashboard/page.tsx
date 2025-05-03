"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { RoleBasedSection } from "@/components/RoleBasedContent"
import { UserRole } from "@prisma/client"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Add debugging
  console.log("Session Status:", status)
  console.log("Session Data:", session)

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    console.log("User is unauthenticated, redirecting to signin")
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto p-4">
      {/* Add session info for debugging */}
      <div className="mb-4 p-4 rounded">
        <h2 className="font-bold">Debug Info:</h2>
        <p>Status: {status}</p>
        <p>User Role: {session?.user?.role}</p>
        <p>User Email: {session?.user?.email}</p>
      </div>

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <RoleBasedSection role={UserRole.ADMIN}>
        <div className=" p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
          <p>Welcome to the admin dashboard. You have full access to all features.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.VENDOR}>
        <div className=" p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Vendor Panel</h2>
          <p>Manage your products and view sales analytics.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.SUPPORT}>
        <div className=" p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Support Panel</h2>
          <p>View customer tickets and provide support.</p>
        </div>
      </RoleBasedSection>

      <RoleBasedSection role={UserRole.USER}>
        <div className=" p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">User Dashboard</h2>
          <p>View your orders and manage your account.</p>
        </div>
      </RoleBasedSection>

      {/* Add sign out button */}
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  )
} 
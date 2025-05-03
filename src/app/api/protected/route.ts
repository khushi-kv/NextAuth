import { NextResponse } from "next/server"
import { withRole } from "@/middleware/role-middleware"
import { UserRole } from "@prisma/client"

// Admin only route
export const GET = withRole(UserRole.ADMIN)(async (req) => {
  return NextResponse.json({
    message: "This is an admin-only route",
    role: "ADMIN",
  })
})

// Vendor only route
export const POST = withRole(UserRole.VENDOR)(async (req) => {
  return NextResponse.json({
    message: "This is a vendor-only route",
    role: "VENDOR",
  })
})

// Support only route
export const PUT = withRole(UserRole.SUPPORT)(async (req) => {
  return NextResponse.json({
    message: "This is a support-only route",
    role: "SUPPORT",
  })
}) 
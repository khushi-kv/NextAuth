import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient, UserRole } from "@prisma/client"
import { withRole } from "@/middleware/role-middleware"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

// Get all users (admin only)
export const GET = withRole(UserRole.ADMIN)(async function handler(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}) 
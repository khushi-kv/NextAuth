import { NextResponse } from "next/server"
import { PrismaClient, UserRole } from "@prisma/client"
import { withRole } from "@/middleware/role-middleware"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

// Update user role (admin only)
export const PATCH = withRole(UserRole.ADMIN)(async (req: NextRequest) => {
  try {
    const { role } = await req.json()
    const userId = req.nextUrl.pathname.split('/').pop()
    
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}) 
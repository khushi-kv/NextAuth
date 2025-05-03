import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

type RouteHandler = (req: NextRequest) => Promise<NextResponse>

/**
 * Middleware factory for role-based access control
 * @param requiredRole - The UserRole required to access the route
 * @returns A middleware function that checks if the user has the required role
 * 
 * @example
 * // Protect a route for admin users only
 * export const GET = withRole(UserRole.ADMIN)(async (req) => {
 *   // Only admin users can access this route
 * })
 */
export function withRole(requiredRole: UserRole) {
  return function middleware(handler: RouteHandler): RouteHandler {
    return async function protectedHandler(req: NextRequest) {
      const token = await getToken({ req })
      
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }

      if (token.role !== requiredRole) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      return handler(req)
    }
  }
}

/**
 * Middleware for routes that require multiple roles
 * @param roles - Array of UserRoles that can access the route
 * @returns A middleware function that checks if the user has any of the required roles
 * 
 * @example
 * // Protect a route for both admin and support users
 * export const GET = withRoles([UserRole.ADMIN, UserRole.SUPPORT])(async (req) => {
 *   // Both admin and support users can access this route
 * })
 */
export async function withRoles(roles: UserRole[]) {
  return async (req: NextRequest) => {
    const token = await getToken({ req })
    
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }

    if (!roles.includes(token.role as UserRole)) {
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      )
    }

    return NextResponse.next()
  }
} 
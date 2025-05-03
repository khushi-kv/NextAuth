import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Permission } from '@prisma/client'

type RouteHandler = (req: NextRequest) => Promise<NextResponse>

export function withPermission(permission: Permission) {
  return function middleware(handler: RouteHandler): RouteHandler {
    return async function protectedHandler(req: NextRequest) {
      const token = await getToken({ req })
      
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }

      if (!Array.isArray(token.permissions) || !token.permissions.includes(permission)) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      return handler(req)
    }
  }
}

export function withPermissions(permissions: Permission[]) {
  return function middleware(handler: RouteHandler): RouteHandler {
    return async function protectedHandler(req: NextRequest) {
      const token = await getToken({ req })
      
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }

      const permissionsArray = Array.isArray(token.permissions) ? token.permissions as Permission[] : [];
      const hasAllPermissions = permissions.every(permission => permissionsArray.includes(permission));

      if (!hasAllPermissions) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      return handler(req)
    }
  }
} 
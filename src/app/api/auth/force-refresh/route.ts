import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  // Only allow force refresh in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Force refresh not available in production' },
      { status: 403 }
    )
  }

  try {
    console.log('🔄 FORCE REFRESH ENDPOINT CALLED')
    const token = await getToken({ req })
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      )
    }

    // Set expiration to 30 days from now
    const now = Math.floor(Date.now() / 1000)
    const newExp = now + (30 * 24 * 60 * 60) // 30 days from now

    console.log('⏰ Setting new expiration:', {
      now: new Date(now * 1000).toISOString(),
      newExp: new Date(newExp * 1000).toISOString()
    })

    // Generate new token with 30 days expiration
    const newToken = {
      ...token,
      exp: newExp,
      iat: now
    }

    return NextResponse.json({
      token: newToken,
      expires: new Date(newExp * 1000).toISOString()
    })
  } catch (error) {
    console.error('❌ ERROR IN FORCE REFRESH:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
} 
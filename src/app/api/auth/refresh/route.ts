import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 REFRESH ENDPOINT CALLED')
    const { refreshToken } = await req.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify the refresh token
    const token = await getToken({ req })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Generate new tokens with 1 minute expiration
    const newAccessToken = {
      accessToken: 'new_access_token', // In production, generate a real token
      refreshToken: 'new_refresh_token', // In production, generate a real token
      exp: Math.floor(Date.now() / 1000) + 60, // 1 minute
    }

    console.log('✨ NEW TOKENS GENERATED:', {
      exp: new Date(newAccessToken.exp * 1000).toISOString()
    })

    return NextResponse.json(newAccessToken)
  } catch (error) {
    console.error('❌ ERROR REFRESHING TOKEN:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
} 
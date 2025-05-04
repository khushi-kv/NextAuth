import { JWT } from "next-auth/jwt"

// Token refresh threshold (5 minutes before expiration)
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

/**
 * Refreshes the access token if it's about to expire
 * @param token - The current JWT token
 * @returns The refreshed token or the original token if not expired
 */
export async function refreshAccessToken(token: JWT): Promise<JWT & { exp: number }> {
  try {
    console.log('🚨 ===== TOKEN REFRESH CHECK STARTED =====')
    console.log('📝 Current token:', JSON.stringify(token, null, 2))
    
    // Check if token needs refresh (expires in less than 5 minutes)
    const shouldRefresh = token.exp && 
      ((token.exp as number) * 1000) - Date.now() < TOKEN_REFRESH_THRESHOLD

    console.log('⏰ TOKEN REFRESH CHECK:', {
      currentTime: new Date().toISOString(),
      tokenExp: new Date((token.exp as number) * 1000).toISOString(),
      shouldRefresh,
      timeUntilExpiry: ((token.exp as number) * 1000) - Date.now(),
      threshold: TOKEN_REFRESH_THRESHOLD
    })

    if (!shouldRefresh) {
      console.log('✅ Token still valid, no refresh needed')
      return token as JWT & { exp: number }
    }

    console.log('🔄 ===== STARTING TOKEN REFRESH =====')
    // Refresh the token
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()
    console.log('✨ ===== TOKEN REFRESHED SUCCESSFULLY =====')
    console.log('📝 New tokens:', JSON.stringify(refreshedTokens, null, 2))

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    }
  } catch (error) {
    console.error('❌ ===== ERROR REFRESHING TOKEN =====')
    console.error('Error details:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    }
  }
}

/**
 * Handles token expiration
 * @param error - The error object
 * @returns A redirect response or null
 */
export function handleTokenExpiration(error: any) {
  if (error?.message === 'Token expired' || error?.error === 'RefreshAccessTokenError') {
    // Redirect to sign in page
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }
  return null
} 
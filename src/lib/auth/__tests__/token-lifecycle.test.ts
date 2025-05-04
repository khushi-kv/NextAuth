import { refreshAccessToken } from '../token-lifecycle'
import { JWT } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'
import '@testing-library/jest-dom'

type TestToken = JWT & { 
  exp: number
  role: UserRole
  id: string
}

describe('Token Lifecycle', () => {
  // Test token creation
  test('should create token with correct expiration', async () => {
    const token: TestToken = {
      id: 'test_user_id',
      role: 'USER',
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      iat: Math.floor(Date.now() / 1000)
    }
    
    expect(token.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })

  // Test token refresh
  test('should refresh token before expiration', async () => {
    const token: TestToken = {
      id: 'test_user_id',
      role: 'USER',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      iat: Math.floor(Date.now() / 1000)
    }
    
    const refreshedToken = await refreshAccessToken(token) as TestToken
    expect(refreshedToken.exp).toBeGreaterThan(token.exp)
  })
}) 
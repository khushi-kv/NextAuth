// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { UserRole } from '@prisma/client'

// Define auth options
const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type assertion to fix adapter compatibility
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            role: true
          }
        })

        if (!user || !user?.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role?.name as UserRole
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  
  // Session Configuration
  // When authentication is successful:
  // 1. Creates a new session in the database
  // 2. Generates a JWT token containing user data
  // 3. Stores the token in secure HTTP-only cookies
  // 4. Sets session expiration based on environment
  session: {
    strategy: 'jwt',
    maxAge: process.env.NODE_ENV === 'development' 
      ? 1 * 60 // 1 minutes in development - for testing
      : 30 * 24 * 60 * 60, // 30 days in production - standard setting
    updateAge: process.env.NODE_ENV === 'development'
      ? 5 * 60 // 5 minutes in development - balanced for testing
      : 24 * 60 * 60, // 24 hours in production - daily refresh
  },

  // JWT Configuration
  // The JWT token contains:
  // 1. User ID for identification
  // 2. User role for authorization
  // 3. Session metadata
  // 4. Expiration timestamp
  jwt: {
    maxAge: process.env.NODE_ENV === 'development'
      ? 1 * 60 // 2 minutes in development - for testing
      : 30 * 24 * 60 * 60, // 30 days in production - standard setting
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // For social logins, ensure user has a role
      if (account?.provider === 'google' || account?.provider === 'github') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { role: true }
        })

        if (!existingUser?.role) {
          // If user exists but has no role, assign USER role
          const userRole = await prisma.role.findFirst({
            where: { name: 'USER' }
          })
          
          if (userRole) {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                roleId: userRole.id
              }
            })
          }
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      // Handle token refresh
      if (trigger === "update") {
        // When the token is updated, fetch fresh user data
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          include: { role: true }
        })
        
        if (dbUser?.role) {
          token.role = dbUser.role.name as UserRole
          token.id = dbUser.id
        }
        
        return { ...token }
      }

      // For social logins, ensure we have the user data
      if (account?.provider === 'google' || account?.provider === 'github') {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          include: { role: true }
        })
        if (dbUser?.role) {
          token.role = dbUser.role.name as UserRole
          token.id = dbUser.id
        }
      } else if (user) {
        // For credentials login
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as UserRole
        session.user.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Enable CSRF protection for all providers
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}

// Export the handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

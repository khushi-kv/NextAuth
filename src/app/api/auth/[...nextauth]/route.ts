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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // For social logins, ensure user has a role
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
    async jwt({ token, user, account }) {
      if (user) {
        // For credentials login
        token.role = user.role
        token.id = user.id
      } else if (token.email) {
        // For social logins, fetch the role
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { role: true }
        })
        if (dbUser?.role) {
          token.role = dbUser.role.name
          token.id = dbUser.id
        }
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
}

// Export the handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

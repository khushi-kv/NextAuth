// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
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
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error("No user found with this email")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account) {
        // This ensures the OAuth account is stored
        return true
      }
      return true
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // 8. Session configuration
  // ARTICLE NOTE: In the article, we'll explain both JWT and Database session strategies
  // with their pros and cons. JWT is stateless and faster, while Database sessions
  // offer better security and control. Here's how to implement both:

  // Option 1: Database Sessions (Current Implementation)
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Option 2: JWT Sessions (Alternative Implementation)
  // Uncomment this section to use JWT instead of database sessions
  /*
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    encryption: true,
  },
  */

  // ARTICLE NOTE: When documenting in the article, we'll include:
  // 1. Performance comparison between JWT and Database sessions
  // 2. Security implications of each approach
  // 3. Use cases for choosing one over the other
  // 4. Code examples for both implementations
  // 5. Migration strategies between the two

  // 9. Use Prisma adapter for database operations
  adapter: PrismaAdapter(prisma),
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

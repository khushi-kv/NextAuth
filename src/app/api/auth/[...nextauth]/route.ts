// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Simulate user authentication
        const user = { id: "1", name: "John Doe", email: "john@example.com" }

        // For demo purposes, authenticate with hardcoded username and password
        if (credentials.username === "admin" && credentials.password === "password") {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT, account?: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: any, token: JWT }) {
      session.accessToken = token.accessToken
      return session
    },
  },
})

export { handler as GET, handler as POST }

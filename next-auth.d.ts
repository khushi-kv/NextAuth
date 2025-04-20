// types/next-auth.d.ts or your global types file
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }

  interface JWT {
    accessToken?: string
  }
}

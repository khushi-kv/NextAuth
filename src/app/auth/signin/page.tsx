// TODO: Article/Docs - Explain OAuthAccountNotLinked error and account linking
// - Show user-friendly error message on sign-in page
// - Suggest users sign in with their original method
// - (Optional) Implement account linking UI in profile/settings page
// - See: https://next-auth.js.org/faq#how-do-i-link-accounts --> this happens when you try to sign in with a different provider than the one you originally used
"use client"


import { Suspense } from "react"
import SignInForm from "@/components/auth/SignInForm"


// Map NextAuth error codes to friendly messages
const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "An account with this email already exists. Please sign in using the originally used method (e.g., email/password or another provider), then link your account in your profile settings.",
  CredentialsSignin: "Invalid email or password.",
  // Add more mappings as needed
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
} 
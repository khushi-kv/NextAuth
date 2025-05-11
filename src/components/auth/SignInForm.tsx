"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify'

// Map NextAuth error codes to friendly messages
const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "An account with this email already exists. Please sign in using the originally used method (e.g., email/password or another provider), then link your account in your profile settings.",
  CredentialsSignin: "Invalid email or password.",
  // Add more mappings as needed
};

// Password validation rules
const passwordRules = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[^A-Za-z0-9]/
}

export default function SignInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const urlError = params.get("error")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (value: string) => {
    const errors: string[] = []
    
    if (value.length < passwordRules.minLength) {
      errors.push(`Password must be at least ${passwordRules.minLength} characters`)
    }
    if (!passwordRules.hasUpperCase.test(value)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!passwordRules.hasLowerCase.test(value)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!passwordRules.hasNumber.test(value)) {
      errors.push("Password must contain at least one number")
    }
    if (!passwordRules.hasSpecialChar.test(value)) {
      errors.push("Password must contain at least one special character")
    }

    setPasswordErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate password before submission
    if (!validatePassword(password)) {
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard"
      })

      if (result?.error) {
        setError(errorMessages[result.error] || result.error)
        toast.error(errorMessages[result.error] || result.error)
      } else if (result?.url) {
        toast.success("Successfully logged in!")
        router.push(result.url)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Use mapped error message if available
  const displayError =
    error ||
    (urlError && errorMessages[urlError]) ||
    (urlError && decodeURIComponent(urlError!))

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {displayError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {displayError}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validatePassword(e.target.value)
                }}
                className="appearance-none cursor-pointer rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {passwordErrors.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Password requirements:
                  </p>
                  <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span>Google</span>
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span>GitHub</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 
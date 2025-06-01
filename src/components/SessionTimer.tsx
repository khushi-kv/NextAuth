'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

/**
 * SessionTimer Component
 * 
 * A utility component that displays and manages session timing.
 * 
 * Key Features:
 * 1. Session Countdown: Shows time remaining until session expiration
 * 2. Auto-refresh: Automatically refreshes session before expiration
 * 3. Cross-tab Persistence: Maintains timer state across browser tabs
 * 
 * NextAuth Session Management:
 * - Sessions are managed by NextAuth.js
 * - JWT strategy is used for session handling
 * - Session duration is configured in [...nextauth]/route.ts
 * 
 * Development vs Production:
 * Development:
 * - Shorter session duration (1 minute) for testing
 * - More frequent updates (5 minutes)
 * - Auto-refresh enabled for testing
 * 
 * Production:
 * - Longer session duration (30 days)
 * - Less frequent updates (24 hours)
 * - Relies on NextAuth's built-in refresh
 */
export default function SessionTimer() {
  const { data: session, update } = useSession()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [refreshStatus, setRefreshStatus] = useState<string>('')
  
  // Store initial expiry time to prevent reset on tab switches
  const initialExpiryRef = useRef<number | null>(null)

  useEffect(() => {
    // Set initial expiry time only once when component mounts
    if (session?.expires && !initialExpiryRef.current) {
      initialExpiryRef.current = new Date(session.expires).getTime()
    }

    const updateTimeLeft = () => {
      if (initialExpiryRef.current) {
        const now = Date.now()
        const remaining = Math.floor((initialExpiryRef.current - now) / 1000)
        setTimeLeft(remaining)

        /**
         * Auto-refresh Logic
         * 
         * This section handles automatic session refresh when expiration is near.
         * 
         * How it works:
         * 1. Checks if session is about to expire (30 seconds remaining)
         * 2. Triggers a refresh using NextAuth's update() function
         * 3. Updates the session expiry time
         * 
         * Important Notes:
         * - This is primarily for development/testing
         * - In production, NextAuth handles refreshes automatically
         * - The 30-second threshold can be adjusted based on needs
         * 
         * NextAuth Configuration (in [...nextauth]/route.ts):
         * session: {
         *   strategy: 'jwt',
         *   maxAge: process.env.NODE_ENV === 'development' 
         *     ? 1 * 60  // 1 minute in development
         *     : 30 * 24 * 60 * 60, // 30 days in production
         *   updateAge: process.env.NODE_ENV === 'development'
         *     ? 5 * 60  // 5 minutes in development
         *     : 24 * 60 * 60, // 24 hours in production
         * }
         */
        if (remaining <= 30 && remaining > 0) {
          handleRefresh()
        }
      }
    }

    // Update immediately
    updateTimeLeft()

    // Update every second
    const timer = setInterval(updateTimeLeft, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(timer)
  }, [session])

  /**
   * Session Refresh Handler
   * 
   * This function handles session refresh using NextAuth's update() function.
   * 
   * Security Considerations:
   * - NextAuth handles CSRF protection
   * - Tokens are rotated securely
   * - Session data is validated
   * 
   * Best Practices:
   * 1. Use update() for manual refreshes
   * 2. Handle refresh failures gracefully
   * 3. Update UI to reflect refresh status
   * 4. Reset expiry time after successful refresh
   */
  const handleRefresh = async () => {
    try {
      setRefreshStatus('Refreshing...')
      await update()
      
      // Reset the initial expiry time
      if (session?.expires) {
        initialExpiryRef.current = new Date(session.expires).getTime()
      }
      
      setRefreshStatus('Refreshed!')
    } catch (error) {
      setRefreshStatus('Refresh failed')
      console.error('Session refresh error:', error)
    }
  }

  /**
   * Time Formatter
   * 
   * Formats remaining time in a user-friendly way.
   * Example: "1m 30s" or "Expired"
   */
  const formatTime = (seconds: number) => {
    if (seconds < 0) return 'Expired'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="text-sm text-gray-600">
        Session expires in: {formatTime(timeLeft)}
      </div>
      {refreshStatus && (
        <div className="mt-1 text-xs text-gray-500">{refreshStatus}</div>
      )}
    </div>
  )
} 
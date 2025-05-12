'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

/**
 * SessionTimer Component
 * 
 * Displays a countdown timer for the current session and handles automatic refresh.
 * Features:
 * - Shows time remaining until session expiration
 * - Auto-refreshes session 30 seconds before expiration
 * - Persists timer across tab switches using useRef
 * - Provides manual refresh button
 * - Shows refresh status
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

        // Auto-refresh when 30 seconds remaining
        if (remaining <= 10 && remaining > 0) {
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
   * Handles session refresh
   * - Calls force-refresh endpoint
   * - Updates session data
   * - Resets initial expiry time
   * - Updates refresh status
   */
  const handleRefresh = async () => {
    try {
      setRefreshStatus('Refreshing...')
      const response = await fetch('/api/auth/force-refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      // Update the session and reset the initial expiry
      await update()
      initialExpiryRef.current = null
      setRefreshStatus('Refreshed!')
    } catch (error) {
      setRefreshStatus('Refresh failed')
      console.error('Session refresh error:', error)
    }
  }

  /**
   * Formats remaining time in minutes and seconds
   * @param seconds - Time remaining in seconds
   * @returns Formatted time string (e.g., "1m 30s") or "Expired"
   */
  const formatTime = (seconds: number) => {
    if (seconds < 0) return 'Expired'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="font-semibold mb-2">Session Timer</h3>
      <p className="text-lg font-mono">
        {formatTime(timeLeft)}
      </p>
      {/* Show warning when refresh is imminent */}
      {timeLeft > 0 && timeLeft <= 30 && (
        <p className="text-yellow-600 text-sm mt-1">Refreshing soon...</p>
      )}
      {/* Display refresh status */}
      {refreshStatus && (
        <p className={`text-sm mt-1 ${refreshStatus.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {refreshStatus}
        </p>
      )}
      {/* Manual refresh button */}
      <button
        onClick={handleRefresh}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        Force Refresh
      </button>
    </div>
  )
} 
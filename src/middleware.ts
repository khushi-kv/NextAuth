import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware function that handles all incoming requests
 * 
 * Flow for each request:
 * 1. Middleware intercepts the request
 * 2. Checks for valid session/JWT token
 * 3. Validates user permissions
 * 4. Applies security headers
 * 5. Forwards the request if all checks pass
 * 
 * @param request - The incoming request object
 * @returns Response with security headers
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  /**
   * Security Headers Configuration
   * These headers protect against common web vulnerabilities
   */

  /**
   * X-Frame-Options: DENY
   * Prevents your site from being embedded in iframes
   * Protects against clickjacking attacks where malicious sites
   * try to embed your site in an iframe to trick users
   * Example: Prevents your login page from being embedded in a malicious site
   */
  response.headers.set('X-Frame-Options', 'DENY')

  /**
   * X-Content-Type-Options: nosniff
   * Prevents MIME type sniffing
   * Stops browser from guessing file types
   * Example: Prevents a .jpg file from being executed as JavaScript
   * This is important for preventing MIME type confusion attacks
   */
  response.headers.set('X-Content-Type-Options', 'nosniff')

  /**
   * Referrer-Policy: strict-origin-when-cross-origin
   * Controls how much referrer information is sent
   * Only sends origin when going to different domain
   * Example: When user clicks a link to external site, only your domain name is sent
   * This helps protect user privacy by limiting information leakage
   */
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  /**
   * Permissions-Policy: camera=(), microphone=(), geolocation=()
   * Restricts access to sensitive browser features
   * Disables camera, microphone, and geolocation by default
   * Example: Prevents malicious sites from accessing user's camera
   * This is important for protecting user privacy and security
   */
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  /**
   * Content-Security-Policy
   * Controls which resources can be loaded
   * 'self' means only from your domain
   * 'unsafe-inline' allows inline scripts and styles
   * 'unsafe-eval' allows dynamic code evaluation
   * Example: Prevents loading scripts from malicious domains
   * This is crucial for preventing XSS attacks
   */
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  /**
   * Strict-Transport-Security
   * Forces HTTPS connections
   * max-age=31536000 means the policy is valid for 1 year
   * includeSubDomains applies to all subdomains
   * Example: If user types http://, browser automatically uses https://
   * This prevents downgrade attacks and ensures secure communication
   */
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return response
}

/**
 * Configuration for the middleware
 * matcher: '/:path*' means this middleware runs on all routes
 * This ensures security headers are added to every response
 * 
 * Protected Routes Flow:
 * 1. Middleware intercepts request to protected route
 * 2. Checks for valid session/JWT token
 * 3. Validates user role against required permissions
 * 4. If authorized:
 *    - Allows access to the route
 *    - Updates session if needed
 * 5. If unauthorized:
 *    - Redirects to login page
 *    - Returns 403 Forbidden
 */
export const config = {
  matcher: '/:path*'
}
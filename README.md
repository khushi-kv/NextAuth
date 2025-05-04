# Next.js Role-Based Access Control (RBAC)

A robust role-based access control system built with Next.js 14, NextAuth.js, and Prisma. This implementation provides secure authentication and authorization with support for multiple user roles and OAuth providers.

## Features

- 🔐 **Authentication**
  - Email/Password authentication with bcrypt hashing
  - OAuth providers (Google, GitHub)
  - JWT-based session management
  - Secure password hashing with bcrypt
  - OAuth account linking support
  - Custom error handling for authentication failures
  - Token refresh mechanism with 30-day expiration
  - Automatic token refresh 5 minutes before expiration

- 👥 **Role-Based Access Control**
  - Multiple user roles (Admin, User, Vendor, Support)
  - Role-based middleware protection
  - Protected API routes
  - Role-based UI components
  - Default role assignment for new users
  - Role management through admin interface

- 🛡️ **Security**
  - Protected routes and API endpoints
  - JWT-based session management
  - Environment variable protection
  - Type-safe database operations
  - Rate limiting support
  - Secure cookie handling
  - Secure token storage and handling
  - Force refresh capability for manual token updates

## Session and Token Management

The application implements a secure token management system:

### JWT Sessions
```typescript
// JWT-based session configuration
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
},
jwt: {
  secret: process.env.NEXTAUTH_SECRET,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  encryption: true,
}
```

### Token Refresh
- Tokens expire after 30 days
- Automatic refresh 5 minutes before expiration
- Manual refresh capability through `/api/auth/force-refresh`
- Secure token storage and handling

## API Routes

- `/api/auth/[...nextauth]` - NextAuth configuration and handlers
- `/api/auth/refresh` - Automatic token refresh endpoint
- `/api/auth/force-refresh` - Manual token refresh endpoint
- `/api/admin/*` - Protected admin routes
- `/api/protected/*` - Role-based protected routes

## Tech Stack

- **Framework:** Next.js 14
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextauth-rbac
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

## Role System

The application implements the following roles:

- **Admin:** Full system access
- **User:** Basic user access
- **Vendor:** Vendor-specific access
- **Support:** Support team access

### Role Assignment

- New users are automatically assigned the "User" role
- Role changes can be made through the admin interface
- OAuth users are assigned a default role upon first login
- Role information is included in the JWT token and session

## Protected Routes

### API Routes
- `/api/admin/*` - Admin-only routes
- `/api/protected/*` - Role-based protected routes
- `/api/auth/refresh` - Token refresh endpoint
- `/api/auth/force-refresh` - Manual token refresh endpoint

### Pages
- `/admin/*` - Admin dashboard and management
- `/dashboard` - User dashboard
- `/auth/*` - Authentication pages

## Middleware Protection

The application uses middleware to protect routes based on user roles:

```typescript
// Example of role-based middleware
export const withRole = (role: UserRole) => {
  return (handler: NextApiHandler) => {
    return async (req: NextRequest, res: NextResponse) => {
      const session = await getServerSession(req, res, authOptions)
      if (!session || session.user.role !== role) {
        return new NextResponse(null, { status: 403 })
      }
      return handler(req, res)
    }
  }
}
```

## Database Schema

The application uses Prisma with the following main models:

- **User:** User accounts and authentication
  - Basic user information (name, email, password)
  - Role relationship
  - OAuth account connections
- **Role:** User roles and permissions
  - Role name (enum: ADMIN, USER, VENDOR, SUPPORT)
  - User relationships
- **Account:** OAuth account connections
  - Provider information
  - Access tokens
  - Refresh tokens
- **Session:** User sessions (when using database sessions)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- Prisma team for the database toolkit

# NextAuth Authentication Implementation

This project implements a secure authentication system using NextAuth.js with the following features:

## Core Features

- JWT-based authentication
- Token refresh mechanism
- Role-based access control
- Session management
- Protected API routes

## Token Management

- Tokens expire after 30 days
- Automatic refresh 5 minutes before expiration
- Secure token storage and handling
- Force refresh capability for manual token updates

## API Routes

- `/api/auth/[...nextauth]` - NextAuth configuration and handlers
- `/api/auth/refresh` - Token refresh endpoint
- `/api/auth/force-refresh` - Manual token refresh endpoint
- `/api/admin/*` - Protected admin routes

## Security Features

- Secure token handling
- Role-based middleware
- Protected API routes
- Session validation
- Type safety

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

For testing token refresh functionality, use the TokenDebug component (not included in production).

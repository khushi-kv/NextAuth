# Next.js Authentication & Authorization System

A comprehensive authentication and authorization system built with Next.js 14, NextAuth.js, and Prisma. This implementation provides secure authentication, role-based access control, and OAuth integration with best practices for security and performance.

## 🌟 Features

### Authentication
- ✅ Email/Password authentication with secure validation
- ✅ Google & GitHub OAuth integration
- ✅ Password visibility toggle
- ✅ Secure password requirements
- ✅ Toast notifications for feedback
- ✅ Form validation and error handling

### Role-Based Access Control
- ✅ Multiple user roles (Admin, Vendor, Support, User)
- ✅ Role-specific dashboards
- ✅ Protected routes and API endpoints
- ✅ Dynamic content based on user role
- ✅ Middleware protection

### Security Features
- ✅ JWT-based session management
- ✅ Automatic token refresh
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Secure password requirements
- ✅ Form validation
- ✅ Error handling

### User Experience
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states
- ✅ Error messages
- ✅ Toast notifications
- ✅ Smooth transitions

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL with Prisma
- **Styling:** Tailwind CSS
- **Notifications:** React-Toastify
- **Type Safety:** TypeScript

## 📦 Installation Steps (In Order)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (Required for Prisma)
- Google OAuth credentials (Optional)
- GitHub OAuth credentials (Optional)

### 2. Backend Setup

#### A. Database Setup (Required First)
1. **Install PostgreSQL**
   - **macOS:**
     ```bash
     brew install postgresql@14
     brew services start postgresql@14
     ```
   - **Ubuntu:**
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     sudo systemctl start postgresql
     sudo systemctl enable postgresql
     ```
   - **Windows:**
     - Download installer from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
     - Run the installer and follow the setup wizard

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE nextauth_db;

   # Create user (optional)
   CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nextauth_db TO myuser;
   ```

#### B. Prisma Setup
1. **Install Prisma**
   ```bash
   npm install prisma --save-dev
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

### 3. Frontend Setup

#### A. Project Setup
1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd nextauth
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database (Required)
   DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/nextauth_db"
   
   # NextAuth (Required)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_ID="your-github-id"
   GITHUB_SECRET="your-github-secret"
   ```

#### B. Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/  # NextAuth configuration
│   ├── auth/
│   │   ├── signin/            # Sign in page
│   │   └── register/          # Registration page
│   └── dashboard/             # Protected dashboard
├── components/
│   └── auth/
│       ├── SignInForm.tsx     # Sign in form
│       └── SignUpForm.tsx     # Registration form
├── SessionTimer.tsx           # Session management component
├── lib/
│   └── auth/                  # Auth utilities
└── prisma/
    └── schema.prisma          # Database schema
```

## 🔐 Database Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(USER)
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum UserRole {
  ADMIN
  VENDOR
  SUPPORT
  USER
}
```

## 🔄 Development Workflow

1. **Backend Changes**
   - Modify `schema.prisma`
   - Run `npx prisma generate`
   - Run `npx prisma db push`

2. **Frontend Changes**
   - Modify components
   - Test in development
   - Build for production

## ⚠️ Important Notes

- Ensure PostgreSQL is installed and running before Prisma setup
- Database must be created before running Prisma commands
- Environment variables must be set correctly
- Prisma Client must be generated after schema changes

## 🔒 Security Best Practices

1. **Authentication**
   - Use secure password hashing
   - Implement rate limiting
   - Enable CSRF protection
   - Set secure session cookies
   - Implement proper error handling

2. **Authorization**
   - Use role-based access control
   - Implement middleware protection
   - Validate user permissions
   - Secure API endpoints
   - Handle unauthorized access

3. **Data Protection**
   - Encrypt sensitive data
   - Use secure database connections
   - Implement input validation
   - Sanitize user inputs
   - Use prepared statements

## 🚀 Performance Optimization

1. **Frontend**
   - Implement code splitting
   - Use dynamic imports
   - Optimize images
   - Enable caching
   - Minimize bundle size

2. **Backend**
   - Optimize database queries
   - Implement caching
   - Use connection pooling
   - Enable compression
   - Monitor performance

## 🎯 Testing

1. **Unit Tests**
   - Test authentication flows
   - Test authorization rules
   - Test form validation
   - Test error handling
   - Test API endpoints

2. **Integration Tests**
   - Test user flows
   - Test role-based access
   - Test session management
   - Test OAuth integration
   - Test error scenarios

## 🔧 Troubleshooting Guide

### Database Issues

1. **Connection Errors**
   ```bash
   Error: P1001: Can't reach database server
   ```
   **Solution:**
   - Verify PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
   - Check database URL in `.env`
   - Ensure database exists: `psql -l`
   - Verify user permissions

2. **Schema Sync Issues**
   ```bash
   Error: P3000: Failed to create database
   ```
   **Solution:**
   - Run `npx prisma generate` first
   - Check database permissions
   - Verify schema.prisma syntax
   - Try `npx prisma db push --force-reset` (⚠️ Warning: This will reset your database)

### Authentication Issues

1. **OAuth Provider Errors**
   ```bash
   Error: OAuth provider not configured
   ```
   **Solution:**
   - Verify OAuth credentials in `.env`
   - Check callback URLs in provider dashboard
   - Ensure NEXTAUTH_URL is set correctly
   - Verify provider is enabled in [...nextauth].ts

2. **Session Problems**
   ```bash
   Error: JWT token expired
   ```
   **Solution:**
   - Check NEXTAUTH_SECRET is set
   - Verify session configuration
   - Clear browser cookies
   - Check token expiration settings

### Development Issues

1. **Build Errors**
   ```bash
   Error: Module not found
   ```
   **Solution:**
   - Run `npm install`
   - Clear Next.js cache: `rm -rf .next`
   - Check import paths
   - Verify TypeScript configuration

2. **Type Errors**
   ```bash
   Error: Type 'X' is not assignable to type 'Y'
   ```
   **Solution:**
   - Run `npx prisma generate` after schema changes
   - Check type definitions
   - Verify TypeScript configuration
   - Update @types packages

### Common Environment Issues

1. **Missing Environment Variables**
   ```bash
   Error: Environment variable not found
   ```
   **Solution:**
   - Copy `.env.example` to `.env`
   - Verify all required variables are set
   - Check variable names match exactly
   - Restart development server

2. **Port Conflicts**
   ```bash
   Error: Port 3000 is already in use
   ```
   **Solution:**
   - Find process: `lsof -i :3000`
   - Kill process: `kill -9 <PID>`
   - Use different port: `npm run dev -- -p 3001`

### Performance Issues

1. **Slow Database Queries**
   **Solution:**
   - Add database indexes
   - Optimize Prisma queries
   - Use connection pooling
   - Implement caching

2. **High Memory Usage**
   **Solution:**
   - Check for memory leaks
   - Optimize image loading
   - Implement code splitting
   - Use production build

### Security Issues

1. **CSRF Token Errors**
   **Solution:**
   - Verify CSRF configuration
   - Check cookie settings
   - Ensure proper headers
   - Update NextAuth.js

2. **Authentication Bypass**
   **Solution:**
   - Verify middleware configuration
   - Check role-based access
   - Review API routes
   - Update security headers


Diagram:
Architecture:https://www.mermaidchart.com/app/projects/cad5eaca-d34f-4cda-b8c4-d64967065108/diagrams/9f864c2c-5fe3-4d4c-b7de-89bc20434466/version/v0.1/edit
Authentication:https://www.mermaidchart.com/app/projects/cad5eaca-d34f-4cda-b8c4-d64967065108/diagrams/4834b83c-e4bb-41f2-af0d-539bb19c572d/version/v0.1/edit
Role Based :https://www.mermaidchart.com/app/projects/cad5eaca-d34f-4cda-b8c4-d64967065108/diagrams/a79bb389-80cd-4bd4-a60d-51a582de032f/version/v0.1/edit
## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
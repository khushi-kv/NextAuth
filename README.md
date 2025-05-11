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

### Important Notes
- ✅ Backend must be set up before Frontend
- ✅ PostgreSQL must be installed and running before Prisma setup
- ✅ Database must be created before running Prisma commands
- ✅ Environment variables must be set correctly
- ✅ Prisma Client must be generated after schema changes

### Development Workflow
1. **Backend Changes**
   - Modify `schema.prisma`
   - Run `npx prisma generate`
   - Run `npx prisma db push`

2. **Frontend Changes**
   - Modify components
   - Test in development
   - Build for production

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

## 🔄 Authentication Flows

### Sign In Flow
```mermaid
sequenceDiagram
    participant User
    participant SignInForm
    participant NextAuth
    participant Database
    participant Dashboard

    User->>SignInForm: Enter credentials
    SignInForm->>NextAuth: Submit credentials
    NextAuth->>Database: Verify credentials
    Database-->>NextAuth: User data
    NextAuth-->>SignInForm: Auth result
    SignInForm->>Dashboard: Redirect on success
```

### Registration Flow
```mermaid
sequenceDiagram
    participant User
    participant SignUpForm
    participant API
    participant Database
    participant SignInForm

    User->>SignUpForm: Enter details
    SignUpForm->>SignUpForm: Validate password
    SignUpForm->>API: Submit registration
    API->>Database: Create user
    Database-->>API: User created
    API-->>SignUpForm: Success response
    SignUpForm->>SignInForm: Redirect to login
```

## 👥 Role-Based Access

### User Roles
- **Admin:** Full system access
- **Vendor:** Product management and sales analytics
- **Support:** Customer ticket management
- **User:** Basic user features

### Role Protection
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

## 🔒 Security Features

### Core Security (Provided by NextAuth)
- ✅ JWT-based session management
- ✅ Automatic token refresh
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Secure password requirements
- ✅ Form validation
- ✅ Error handling

### Additional Security (Optional)
For production environments, consider implementing:
- ⚠️ IP blocking (blocks suspicious IPs)
- ⚠️ Custom security headers (additional protection)
- ⚠️ Request throttling (limits request frequency)

Note: These additional security measures are not part of NextAuth.js core functionality but can be implemented for enhanced security in production environments.

## 🚀 Performance Optimization

### Token Optimization
- Minimal JWT payload
- Efficient session storage
- Automatic cleanup

### Database Optimization
- Indexed queries
- Efficient relations
- Connection pooling

## 📝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team
- NextAuth.js team
- Prisma team
- All contributors

## 🗄️ Prisma Setup & Commands

### Initial Setup
```bash
# Install Prisma CLI
npm install prisma --save-dev

# Initialize Prisma in your project
npx prisma init

# After modifying schema.prisma, generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push
```

### Database Management
```bash
# Create a new migration
npx prisma migrate dev --name init

# Apply pending migrations
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# View database with Prisma Studio
npx prisma studio
```

### Common Prisma Commands
```bash
# Format schema.prisma file
npx prisma format

# Validate schema.prisma file
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Check database status
npx prisma db pull
```

### Development Workflow
1. Make changes to `schema.prisma`
2. Run `npx prisma generate` to update Prisma Client
3. Run `npx prisma db push` to update database schema
4. Use Prisma Studio (`npx prisma studio`) to view/edit data

### Production Deployment
```bash
# Generate Prisma Client for production
npx prisma generate

# Apply migrations in production
npx prisma migrate deploy
```

## 🐘 PostgreSQL Setup

### Installation

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

3. **Update Environment Variables**
   ```env
   # For local development
   DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/nextauth_db"
   ```

### Database Connection

1. **Test Connection**
   ```bash
   # Connect to database
   psql -U myuser -d nextauth_db
   
   # List tables (after Prisma setup)
   \dt
   ```

2. **Common PostgreSQL Commands**
   ```sql
   -- List all databases
   \l

   -- Connect to database
   \c nextauth_db

   -- List all tables
   \dt

   -- Describe table
   \d table_name

   -- Exit
   \q
   ```

### Troubleshooting

1. **Connection Issues**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure database exists
   - Check port availability (default: 5432)

2. **Permission Issues**
   - Verify user privileges
   - Check database ownership
   - Ensure correct password

3. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Check Prisma logs for errors
   - Verify DATABASE_URL format
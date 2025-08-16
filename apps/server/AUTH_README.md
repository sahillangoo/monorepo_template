# Authentication System Documentation

This document describes the comprehensive authentication system implemented for the e-commerce application using Better Auth principles with custom JWT implementation.

## Overview

The authentication system provides:
- **Role-based access control** with 4 user roles
- **JWT token management** with configurable expiration
- **Password hashing** using bcrypt
- **Email verification** and password reset functionality
- **Middleware-based protection** for routes
- **Zod schema validation** for all API requests

## User Roles & Hierarchy

### Role Levels (from highest to lowest)
1. **SUPER_ADMIN** (Level 4) - Full system access
2. **ADMIN** (Level 3) - Administrative functions
3. **SHOP_MANAGER** (Level 2) - Shop management
4. **CUSTOMER** (Level 1) - Basic user access

### Role Permissions
- **SUPER_ADMIN**: Can modify any user's role
- **ADMIN**: Can modify SHOP_MANAGER and CUSTOMER roles
- **SHOP_MANAGER**: Can manage products and orders
- **CUSTOMER**: Can place orders and manage their profile

## API Endpoints

### Public Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/reset` - Reset password with token
- `POST /api/auth/verify-email` - Verify email with token

### Protected Endpoints
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/roles/update` - Update user role (requires ADMIN+ role)

## Authentication Flow

### 1. User Registration
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "CUSTOMER" // Optional, defaults to CUSTOMER
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CUSTOMER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 2. User Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

### 3. Using Protected Routes
Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Middleware

### Authentication Middleware
- `authenticateToken` - Validates JWT and injects user context
- `optionalAuth` - Optional authentication (doesn't fail if no token)

### Role-based Middleware
- `requireSuperAdmin` - Requires SUPER_ADMIN role
- `requireAdmin` - Requires ADMIN or higher role
- `requireShopManager` - Requires SHOP_MANAGER or higher role
- `requireCustomer` - Requires CUSTOMER or higher role (all authenticated users)

### Usage Example
```javascript
app.openapi(
  createRoute({ /* route config */ }),
  authenticateToken,        // Must be authenticated
  requireAdmin,            // Must have ADMIN+ role
  handlerFunction
);
```

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(CUSTOMER)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders    Order[]
  cart      Cart?
  passwordResetTokens PasswordResetToken[]
  emailVerificationTokens EmailVerificationToken[]
}
```

### Token Models
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## Security Features

### Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 6 characters required
- **Reset**: Secure token-based password reset

### JWT Security
- **Secret**: Configurable via environment variable
- **Expiration**: Configurable (default: 7 days)
- **Payload**: Contains only necessary user information

### Role Security
- **Hierarchy**: Strict role-based access control
- **Validation**: Server-side role validation
- **Escalation Prevention**: Users cannot promote themselves to higher roles

## Environment Variables

```bash
# Required
JWT_SECRET="your-super-secret-jwt-key-here"
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Optional
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```

## Error Handling

### Standard Error Responses
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

## Development Setup

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Environment Variables
```bash
cp env.dev.example .env
# Edit .env with your actual values
```

### 3. Database Setup
```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Seed database (optional)
bun run db:seed
```

### 4. Start Server
```bash
bun run dev
```

## Testing the Authentication System

### 1. Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login with the user
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access protected route
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <token_from_login>"
```

## Future Enhancements

- [ ] Email service integration for password reset
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Rate limiting
- [ ] Audit logging
- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Account lockout after failed attempts

## Security Best Practices

1. **Never store plain text passwords**
2. **Use strong JWT secrets** (32+ characters)
3. **Implement rate limiting** for auth endpoints
4. **Use HTTPS in production**
5. **Regular security audits**
6. **Keep dependencies updated**
7. **Implement proper logging** for security events

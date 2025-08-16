# Better Auth Integration with Hono - Implementation Guide

## Overview

This implementation provides a complete authentication system using Better Auth with Hono for the ecommerce monorepo. The system includes role-based authentication, JWT/session management, password reset, email verification, and comprehensive API endpoints.

## Architecture

### 1. Authentication Stack
- **Better Auth**: Core authentication library
- **Hono**: Web framework for API endpoints
- **Prisma**: Database ORM with PostgreSQL
- **Zod**: Schema validation for API requests

### 2. Role-Based Access Control (RBAC)
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Administrative privileges
- **SHOP_MANAGER**: Store management access
- **CUSTOMER**: Basic user access

## File Structure

```
src/
├── lib/
│   └── better-auth.js          # Better Auth configuration
├── middleware/
│   └── better-auth.js          # Authentication middleware
├── routes/
│   └── auth/
│       ├── index.js            # Auth route exports
│       ├── better-auth.js      # Better Auth handler
│       ├── login.js            # Login endpoint
│       ├── register.js         # Registration endpoint
│       ├── password-reset.js   # Password reset endpoints
│       ├── verify-email.js     # Email verification endpoints
│       └── roles.js            # Role management endpoints
├── index.js                    # Main server file
└── index-simple.js             # Simplified Better Auth example
```

## Key Features Implemented

### 1. Authentication Configuration (`src/lib/better-auth.js`)
```javascript
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  trustedOrigins: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:3001'],
  emailAndPassword: { enabled: true },
  emailVerification: { enabled: true, sendOnSignUp: true },
  session: { enabled: true, expiresIn: 60 * 60 * 24 * 7 }, // 7 days
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL
});
```

### 2. Prisma Schema Integration
The schema includes Better Auth required models plus custom ecommerce models:
- **User**: Extended with role field and ecommerce relations
- **Session**: Better Auth session management
- **Account**: Better Auth account linking
- **Verification**: Better Auth email verification
- **Product, Cart, Order**: Ecommerce models

### 3. Authentication Endpoints

#### Better Auth Endpoints (handled automatically)
- `POST /api/auth/sign-in` - User sign in
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/send-verification-email` - Resend verification

#### Custom Endpoints (with Zod validation)
- `POST /api/auth/login` - Enhanced login with role info
- `POST /api/auth/register` - Registration with role assignment
- `POST /api/auth/password-reset/request` - Password reset request
- `POST /api/auth/password-reset` - Password reset confirmation
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/roles/update` - Update user role (admin only)
- `GET /api/auth/users` - Get all users (admin only)

### 4. Middleware Implementation

#### Authentication Middleware
```javascript
export const authenticateUser = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ success: false, message: 'Authentication required' }, 401);
  }

  c.set('user', session.user);
  c.set('session', session.session);
  await next();
};
```

#### Role-Based Access Control
```javascript
export const requireRole = (requiredRole) => {
  return async (c, next) => {
    const user = c.get('user');
    if (!hasRole(user.role, requiredRole)) {
      return c.json({ success: false, message: 'Insufficient permissions' }, 403);
    }
    await next();
  };
};
```

### 5. Request/Response Schemas

All endpoints use Zod schemas for validation:

```javascript
// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Register schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['CUSTOMER', 'SHOP_MANAGER']).default('CUSTOMER')
});
```

## Environment Variables Required

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerceappdb"
BETTER_AUTH_SECRET="your-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3001"
```

## Usage Examples

### 1. User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "CUSTOMER"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Route
```bash
curl -X GET http://localhost:3001/api/profile \
  -H "Authorization: Bearer <session-token>" \
  -H "Cookie: <session-cookie>"
```

### 4. Admin Operations
```bash
# Get all users (admin only)
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <admin-session-token>"

# Update user role (admin only)
curl -X PUT http://localhost:3001/api/auth/roles/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-session-token>" \
  -d '{
    "userId": "user-id",
    "role": "SHOP_MANAGER"
  }'
```

## Installation & Setup

1. **Install Dependencies** (already done):
   ```bash
   bun install
   ```

2. **Set Up Environment**:
   ```bash
   cp env.dev.example .env
   # Add Better Auth variables to .env
   ```

3. **Database Setup**:
   ```bash
   bun run db:push
   ```

4. **Start Development Server**:
   ```bash
   bun run dev
   ```

## API Documentation

The server provides OpenAPI documentation at:
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI Spec**: http://localhost:3001/api-docs

## Security Features

1. **Session Management**: 7-day session expiration
2. **Password Requirements**: Minimum 6 characters
3. **Email Verification**: Required for account activation
4. **Role Hierarchy**: Enforced permissions system
5. **CORS Configuration**: Configured for frontend origins
6. **Secure Headers**: Applied via Hono middleware

## Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Authentication Flow Test
1. Register new user
2. Verify email (if verification enabled)
3. Login to get session
4. Access protected routes with session
5. Test role-based access

## Advanced Configuration

### Custom Role Hierarchy
Modify `roleHierarchy` in `better-auth.js`:
```javascript
export const roleHierarchy = {
  'SUPER_ADMIN': 4,
  'ADMIN': 3,
  'SHOP_MANAGER': 2,
  'CUSTOMER': 1,
};
```

### Email Provider Setup
Add email configuration to Better Auth config for production:
```javascript
// In better-auth.js
emailVerification: {
  enabled: true,
  sendOnSignUp: true,
  emailProvider: {
    // Configure your email provider
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **CORS Errors**: Check trustedOrigins in Better Auth config
3. **Session Issues**: Verify BETTER_AUTH_SECRET is set
4. **Role Access**: Check user role and hierarchy configuration

### Debug Mode
Enable debug logging:
```javascript
// In better-auth.js
export const auth = betterAuth({
  // ... other config
  debug: process.env.NODE_ENV === 'development'
});
```

## Next Steps

1. **Frontend Integration**: Connect with React/Vue frontend
2. **Email Provider**: Configure SMTP/SendGrid for production
3. **Social Authentication**: Add OAuth providers
4. **Rate Limiting**: Add request rate limiting
5. **Audit Logging**: Add user action logging
6. **2FA**: Implement two-factor authentication

This implementation provides a solid foundation for authentication in your ecommerce application with proper role-based access control, session management, and security best practices.

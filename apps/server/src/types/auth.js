import { z } from 'zod';

// Role enum matching Prisma schema
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SHOP_MANAGER: 'SHOP_MANAGER',
  CUSTOMER: 'CUSTOMER'
};

// Zod schemas for authentication
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum([UserRole.CUSTOMER, UserRole.SHOP_MANAGER]).default(UserRole.CUSTOMER)
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
});

export const updateRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(Object.values(UserRole), 'Invalid role')
});

// Response schemas
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().nullable(),
      role: z.enum(Object.values(UserRole)),
      createdAt: z.string()
    }),
    token: z.string()
  }).optional()
});

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(Object.values(UserRole)),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Role hierarchy for access control
export const roleHierarchy = {
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ADMIN]: 3,
  [UserRole.SHOP_MANAGER]: 2,
  [UserRole.CUSTOMER]: 1
};

// Check if user has required role or higher
export const hasRole = (userRole, requiredRole) => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Check if user can modify another user's role
export const canModifyRole = (currentUserRole, targetUserRole) => {
  return roleHierarchy[currentUserRole] > roleHierarchy[targetUserRole];
};

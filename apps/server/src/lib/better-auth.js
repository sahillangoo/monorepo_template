import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();

// Create the Better Auth instance
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Allow requests from the frontend development server
  trustedOrigins: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:3001'],
  emailAndPassword: {
    enabled: true,
    // Customize password requirements
    password: {
      minLength: 6,
      maxLength: 128,
    },
  },
  // Enable session management
  session: {
    enabled: true,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  // Email verification settings
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
  },
  // Configure advanced session settings
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
  // Configure secret from environment
  secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-here',
  // Base URL for Better Auth
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
});

// Export the auth type for TypeScript/JSDoc
/**
 * @typedef {Object} AuthType
 * @property {Object|null} user - The authenticated user or null
 * @property {Object|null} session - The session object or null
 */

// Role hierarchy for access control
export const roleHierarchy = {
  'SUPER_ADMIN': 4,
  'ADMIN': 3,
  'SHOP_MANAGER': 2,
  'CUSTOMER': 1,
};

// Helper functions for role-based access control
export const hasRole = (userRole, requiredRole) => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canModifyRole = (currentUserRole, targetUserRole) => {
  return roleHierarchy[currentUserRole] > roleHierarchy[targetUserRole];
};

// Export auth utilities
export const authUtils = {
  hasRole,
  canModifyRole,
};

// Export prisma instance for use in other files
export { prisma };

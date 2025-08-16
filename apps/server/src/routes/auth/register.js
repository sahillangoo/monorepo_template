import { createRoute, z } from '@hono/zod-openapi';
import { auth } from '../../lib/better-auth.js';

// Register request schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['CUSTOMER', 'SHOP_MANAGER']).default('CUSTOMER')
});

// Register response schema
export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().nullable(),
      role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER', 'CUSTOMER']),
      emailVerified: z.boolean(),
      createdAt: z.string()
    }),
          token: z.string()
  }).optional()
});

// Register route definition
export const registerRoute = createRoute({
  method: 'post',
  path: '/api/auth/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: registerResponseSchema
        }
      },
      description: 'Registration successful'
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            errors: z.array(z.any()).optional()
          })
        }
      },
      description: 'Validation error'
    },
    409: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'User already exists'
    }
  },
  tags: ['Authentication']
});

// Register handler
export const registerHandler = async (c) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { email, password, name, role } = validationResult.data;

    // Use Better Auth sign-up
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // We'll handle role assignment separately since Better Auth doesn't handle custom fields in sign-up
      },
      headers: c.req.raw.headers
    });

    if (!result) {
      return c.json({
        success: false,
        message: 'Registration failed'
      }, 400);
    }

    // Update user role if not default
    if (role !== 'CUSTOMER') {
      // This would require a separate database update since Better Auth doesn't handle custom fields during signup
      // We'll need to update the user record separately
      const { prisma } = await import('../../lib/better-auth.js');
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role }
      });
    }

    return c.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          ...result.user,
          role: role
        },
        token: result.token || ''
      }
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message?.includes('already exists') || error.message?.includes('unique constraint')) {
      return c.json({
        success: false,
        message: 'User with this email already exists'
      }, 409);
    }

    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

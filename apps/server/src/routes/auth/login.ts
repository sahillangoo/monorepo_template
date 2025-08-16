import { createRoute, z } from '@hono/zod-openapi';
import { auth } from '../../lib/better-auth.js';

// Login request schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Login response schema
export const loginResponseSchema = z.object({
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
    session: z.object({
      id: z.string(),
      expiresAt: z.string(),
      token: z.string()
    })
  }).optional()
});

// Login route definition
export const loginRoute = createRoute({
  method: 'post',
  path: '/api/auth/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginResponseSchema
        }
      },
      description: 'Login successful'
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
    401: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'Authentication failed'
    }
  },
  tags: ['Authentication']
});

// Login handler
export const loginHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { email, password } = validationResult.data;

    // Use Better Auth sign-in
    const result = await auth.api.signInEmail({
      body: {
        email,
        password
      },
      headers: c.req.raw.headers
    });

    if (!result) {
      return c.json({
        success: false,
        message: 'Invalid email or password'
      }, 401);
    }

    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        session: result.session || { id: '', expiresAt: '', token: '' }
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.message?.includes('Invalid')) {
      return c.json({
        success: false,
        message: 'Invalid email or password'
      }, 401);
    }

    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

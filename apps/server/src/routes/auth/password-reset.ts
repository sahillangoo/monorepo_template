import { createRoute, z } from '@hono/zod-openapi';
import { auth } from '../../lib/better-auth.js';

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email format')
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Password reset request route
export const passwordResetRequestRoute = createRoute({
  method: 'post',
  path: '/api/auth/password-reset/request',
  request: {
    body: {
      content: {
        'application/json': {
          schema: passwordResetRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'Password reset email sent'
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
    }
  },
  tags: ['Authentication']
});

// Password reset route
export const passwordResetRoute = createRoute({
  method: 'post',
  path: '/api/auth/password-reset',
  request: {
    body: {
      content: {
        'application/json': {
          schema: passwordResetSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'Password reset successful'
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
      description: 'Validation or token error'
    }
  },
  tags: ['Authentication']
});

// Password reset request handler
export const passwordResetRequestHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = passwordResetRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { email } = validationResult.data;

    // Use Better Auth forget password
    await auth.api.forgetPassword({
      body: { email },
      headers: c.req.raw.headers
    });

    return c.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);

    // Always return success for security (don't reveal if email exists)
    return c.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });
  }
};

// Password reset handler
export const passwordResetHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = passwordResetSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { token, password } = validationResult.data;

    // Use Better Auth reset password
    const result = await auth.api.resetPassword({
      body: { token, newPassword: password },
      headers: c.req.raw.headers
    });

    if (!result) {
      return c.json({
        success: false,
        message: 'Invalid or expired reset token'
      }, 400);
    }

    return c.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error: any) {
    console.error('Password reset error:', error);

    if (error.message?.includes('Invalid') || error.message?.includes('expired')) {
      return c.json({
        success: false,
        message: 'Invalid or expired reset token'
      }, 400);
    }

    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

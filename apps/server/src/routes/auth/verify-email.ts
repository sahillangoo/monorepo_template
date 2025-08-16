import { createRoute, z } from '@hono/zod-openapi';
import { auth } from '../../lib/better-auth.js';

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
});

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email format')
});

// Email verification route
export const emailVerificationRoute = createRoute({
  method: 'post',
  path: '/api/auth/verify-email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: emailVerificationSchema
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
      description: 'Email verification successful'
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

// Resend verification email route
export const resendVerificationRoute = createRoute({
  method: 'post',
  path: '/api/auth/resend-verification',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resendVerificationSchema
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
      description: 'Verification email sent'
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

// Email verification handler
export const emailVerificationHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = emailVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { token } = validationResult.data;

    // Use Better Auth verify email
    await auth.api.verifyEmail({
      body: { token },
      headers: c.req.raw.headers
    });

    if (!result) {
      return c.json({
        success: false,
        message: 'Invalid or expired verification token'
      }, 400);
    }

    return c.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error: any) {
    console.error('Email verification error:', error);

    if (error.message?.includes('Invalid') || error.message?.includes('expired')) {
      return c.json({
        success: false,
        message: 'Invalid or expired verification token'
      }, 400);
    }

    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

// Resend verification email handler
export const resendVerificationHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validationResult = resendVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { email } = validationResult.data;

    // Use Better Auth send verification email
    await auth.api.sendVerificationEmail({
      body: { email },
      headers: c.req.raw.headers
    });

    return c.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);

    // Always return success for security (don't reveal if email exists)
    return c.json({
      success: true,
      message: 'If an account with this email exists, a verification email has been sent'
    });
  }
};

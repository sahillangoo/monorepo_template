import { createRoute, z } from '@hono/zod-openapi';
import { prisma, hasRole, canModifyRole } from '../../lib/better-auth.js';

// Update role schema
export const updateRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER', 'CUSTOMER'], 'Invalid role')
});

// Get user profile schema
export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER', 'CUSTOMER']),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Get all users schema (for admin)
export const usersListSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(userProfileSchema)
});

// Get user profile route
export const getUserProfileRoute = createRoute({
  method: 'get',
  path: '/api/auth/profile',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: userProfileSchema
          })
        }
      },
      description: 'User profile retrieved'
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
      description: 'Authentication required'
    }
  },
  tags: ['Authentication', 'Profile']
});

// Update role route
export const updateRoleRoute = createRoute({
  method: 'put',
  path: '/api/auth/roles/update',
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateRoleSchema
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
            message: z.string(),
            data: userProfileSchema
          })
        }
      },
      description: 'Role updated successfully'
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
    403: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'Insufficient permissions'
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'User not found'
    }
  },
  tags: ['Authentication', 'Admin']
});

// Get all users route (admin only)
export const getAllUsersRoute = createRoute({
  method: 'get',
  path: '/api/auth/users',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: usersListSchema
        }
      },
      description: 'Users list retrieved'
    },
    403: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      },
      description: 'Admin access required'
    }
  },
  tags: ['Authentication', 'Admin']
});

// Get user profile handler
export const getUserProfileHandler = async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found in context'
      }, 401);
    }

    // Get fresh user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!userData) {
      return c.json({
        success: false,
        message: 'User not found'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        ...userData,
        createdAt: userData.createdAt.toISOString(),
        updatedAt: userData.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

// Update role handler
export const updateRoleHandler = async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();

    // Validate request body
    const validationResult = updateRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues
      }, 400);
    }

    const { userId, role } = validationResult.data;

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return c.json({
        success: false,
        message: 'User not found'
      }, 404);
    }

    // Check if current user can modify target user's role
    if (!canModifyRole(currentUser.role, targetUser.role)) {
      return c.json({
        success: false,
        message: 'Insufficient permissions to modify this user\'s role'
      }, 403);
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return c.json({
      success: true,
      message: 'Role updated successfully',
      data: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

// Get all users handler (admin only)
export const getAllUsersHandler = async (c) => {
  try {
    const currentUser = c.get('user');

    // Only admins and super admins can access user list
    if (!hasRole(currentUser.role, 'ADMIN')) {
      return c.json({
        success: false,
        message: 'Admin access required'
      }, 403);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({
      success: false,
      message: 'Internal server error'
    }, 500);
  }
};

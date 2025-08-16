import { auth, hasRole } from '../lib/better-auth.js';

// Better Auth authentication middleware
export const authenticateUser = async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      c.set('user', null);
      c.set('session', null);
      return c.json({
        success: false,
        message: 'Authentication required'
      }, 401);
    }

    // Inject user and session into context
    c.set('user', session.user);
    c.set('session', session.session);

    await next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return c.json({
      success: false,
      message: 'Authentication failed'
    }, 500);
  }
};

// Optional authentication middleware (doesn't fail if no session)
export const optionalAuth = async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session) {
      c.set('user', session.user);
      c.set('session', session.session);
    } else {
      c.set('user', null);
      c.set('session', null);
    }

    await next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue without authentication
    c.set('user', null);
    c.set('session', null);
    await next();
  }
};

// Role-based access control middleware
export const requireRole = (requiredRole) => {
  return async (c, next) => {
    try {
      const user = c.get('user');

      if (!user) {
        return c.json({
          success: false,
          message: 'Authentication required'
        }, 401);
      }

      if (!hasRole(user.role, requiredRole)) {
        return c.json({
          success: false,
          message: 'Insufficient permissions'
        }, 403);
      }

      await next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return c.json({
        success: false,
        message: 'Authorization failed'
      }, 500);
    }
  };
};

// Admin-only middleware
export const requireAdmin = requireRole('ADMIN');

// Super Admin middleware
export const requireSuperAdmin = requireRole('SUPER_ADMIN');

// Shop Manager or higher middleware
export const requireShopManager = requireRole('SHOP_MANAGER');

// Customer or higher middleware (allows all authenticated users)
export const requireCustomer = requireRole('CUSTOMER');

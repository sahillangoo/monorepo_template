import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { auth } from './lib/better-auth.js';

// Load environment variables
dotenv.config();

const app = new OpenAPIHono();
const prisma = new PrismaClient();

// Database connection check function
async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Initialize database connection
let isDatabaseConnected = false;

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:3001'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use('*', secureHeaders());

// Swagger UI
app.get('/docs', swaggerUI({ url: '/api-docs' }));

// Health check endpoint
app.openapi(
	createRoute({
		method: 'get',
		path: '/health',
		responses: {
			200: {
				content: {
					'application/json': {
						schema: z.object({
							status: z.string(),
							message: z.string(),
							timestamp: z.string(),
							database: z.object({
								status: z.string(),
								connected: z.boolean()
							})
						})
					}
				},
				description: 'Health check response'
			}
		},
		tags: ['Health']
	}),
	async c => {
		return c.json({
			status: 'OK',
			message: 'server is running',
			timestamp: new Date().toISOString(),
			database: {
				status: isDatabaseConnected ? 'Connected' : 'Disconnected',
				connected: isDatabaseConnected
			}
		});
	}
);

// Better Auth routes - Mount all auth endpoints
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// Authentication middleware
const authenticateUser = async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
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

// Role-based access control
const requireRole = (requiredRole) => {
  return async (c, next) => {
    try {
      const user = c.get('user');

      if (!user) {
        return c.json({
          success: false,
          message: 'Authentication required'
        }, 401);
      }

      const roleHierarchy = {
        'SUPER_ADMIN': 4,
        'ADMIN': 3,
        'SHOP_MANAGER': 2,
        'CUSTOMER': 1,
      };

      if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
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

// Protected route examples
app.openapi(
	createRoute({
		method: 'get',
		path: '/api/profile',
		responses: {
			200: {
				content: {
					'application/json': {
						schema: z.object({
							success: z.boolean(),
							message: z.string(),
							data: z.any()
						})
					}
				},
				description: 'User profile'
			}
		},
		tags: ['Authentication']
	}),
	authenticateUser,
	async (c) => {
		const user = c.get('user');
		return c.json({
			success: true,
			message: 'Profile retrieved successfully',
			data: user
		});
	}
);

app.openapi(
	createRoute({
		method: 'get',
		path: '/api/admin/users',
		responses: {
			200: {
				content: {
					'application/json': {
						schema: z.object({
							success: z.boolean(),
							message: z.string(),
							data: z.array(z.any())
						})
					}
				},
				description: 'Users list'
			}
		},
		tags: ['Admin']
	}),
	authenticateUser,
	requireRole('ADMIN'),
	async (c) => {
		const users = await prisma.user.findMany({
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
			message: 'Users retrieved successfully',
			data: users
		});
	}
);

// Products endpoint
app.openapi(
	createRoute({
		method: 'get',
		path: '/api/products',
		responses: {
			200: {
				content: {
					'application/json': {
						schema: z.object({
							message: z.string(),
							data: z.array(z.any())
						})
					}
				},
				description: 'Products list'
			}
		},
		tags: ['Products']
	}),
	async c => {
		try {
			if (!isDatabaseConnected) {
				console.error('❌ Products endpoint called but database is not connected');
				return c.json({
					error: 'Database not connected',
					message: 'Cannot fetch products - database connection failed'
				}, 503);
			}

			const products = await prisma.product.findMany();
			return c.json({
				message: 'Products retrieved successfully',
				data: products
			});
		} catch (error) {
			console.error('❌ Error fetching products:', error);
			return c.json({
				error: 'Failed to fetch products',
				message: error.message
			}, 500);
		}
	}
);

// OpenAPI documentation
app.doc('/api-docs', {
	openapi: '3.0.0',
	info: {
		title: 'E-commerce API with Better Auth',
		version: '1.0.0',
		description: 'API documentation for the e-commerce application with Better Auth integration'
	},
	servers: [
		{
			url: 'http://localhost:3001',
			description: 'Development server'
		}
	]
});

// Error handling
app.onError((err, c) => {
	console.error('Error:', err);
	return c.json({ error: 'Internal server error' }, 500);
});

// Initialize database connection when module loads
(async () => {
    try {
        console.log('🔌 Connecting to database...');
        isDatabaseConnected = await checkDatabaseConnection();
        if (isDatabaseConnected) {
            console.log('✅ Database connected and ready');
        }

        // Show server endpoints info
        const port = process.env.PORT || 3001;
        console.log(`✅ Server running on port ${port}`);
        console.log(`📱 Health check: http://localhost:${port}/health`);
        console.log(`🔐 Auth endpoints: http://localhost:${port}/api/auth/*`);
        console.log(`👤 Profile: http://localhost:${port}/api/profile`);
        console.log(`👥 Admin users: http://localhost:${port}/api/admin/users`);
        console.log(`🛍️  Products API: http://localhost:${port}/api/products`);
        console.log(`📚 API Docs: http://localhost:${port}/docs`);
        console.log(`🔍 OpenAPI: http://localhost:${port}/api-docs`);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
})();

// Graceful shutdown handlers
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await gracefulShutdown();
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await gracefulShutdown();
});

async function gracefulShutdown() {
    try {
        console.log('🔌 Closing database connection...');
        await prisma.$disconnect();
        console.log('✅ Database connection closed');
        console.log('👋 Server shutdown complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

export default app;

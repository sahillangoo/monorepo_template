import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// Load environment variables
dotenv.config();

const app = new OpenAPIHono();
const prisma = new PrismaClient();

// Middleware
app.use('*', logger());
app.use('*', cors());
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
							timestamp: z.string()
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
			message: 'E-commerce server is running',
			timestamp: new Date().toISOString()
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
			const products = await prisma.product.findMany();
			return c.json({
				message: 'Products retrieved successfully',
				data: products
			});
		} catch {
			return c.json({ error: 'Failed to fetch products' }, 500);
		}
	}
);

// Cart endpoint
app.openapi(
	createRoute({
		method: 'get',
		path: '/api/cart',
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
				description: 'Cart items'
			}
		},
		tags: ['Cart']
	}),
	async c => {
		return c.json({
			message: 'Cart endpoint - to be implemented',
			data: []
		});
	}
);

// OpenAPI documentation
app.doc('/api-docs', {
	openapi: '3.0.0',
	info: {
		title: 'E-commerce API',
		version: '1.0.0',
		description: 'API documentation for the e-commerce application'
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

// Start server
const PORT = process.env.PORT || 3001;
console.log(`🚀 Server running on port ${PORT}`);
console.log(`📱 Health check: http://localhost:${PORT}/health`);
console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
console.log(`📚 API Docs: http://localhost:${PORT}/docs`);
console.log(`🔍 OpenAPI: http://localhost:${PORT}/api-docs`);

export default {
	port: PORT,
	fetch: app.fetch
};

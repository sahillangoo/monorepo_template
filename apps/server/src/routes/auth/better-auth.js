import { createRoute, z } from '@hono/zod-openapi';
import { auth } from '../../lib/better-auth.js';

// Better Auth Handler Route
export const betterAuthRoute = createRoute({
  method: 'post',
  path: '/api/auth/{path}',
  request: {
    params: z.object({
      path: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.any()
        }
      },
      description: 'Auth response'
    }
  },
  tags: ['Authentication']
});

// Handler for Better Auth endpoints
export const betterAuthHandler = async (c) => {
  return auth.handler(c.req.raw);
};

// GET handler for Better Auth
export const betterAuthGetRoute = createRoute({
  method: 'get',
  path: '/api/auth/{path}',
  request: {
    params: z.object({
      path: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.any()
        }
      },
      description: 'Auth response'
    }
  },
  tags: ['Authentication']
});

export const betterAuthGetHandler = async (c) => {
  return auth.handler(c.req.raw);
};

# E-commerce Server

This is the backend server for the e-commerce application, built with Express.js.

## Features

- **Express.js**: Fast, unopinionated web framework
- **CORS**: Cross-origin resource sharing enabled
- **Helmet**: Security middleware for Express
- **Health Check**: Basic health monitoring endpoint
- **API Routes**: Placeholder endpoints for products and cart

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Start production server
bun run start
```

### Available Scripts

- `bun run dev` - Start development server with auto-reload
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run build` - No build step needed for Node.js

### Environment Variables

- `PORT` - Server port (default: 3001)

### API Endpoints

- `GET /health` - Health check
- `GET /api/products` - Products endpoint (placeholder)
- `GET /api/cart` - Cart endpoint (placeholder)

## Development

The server runs on port 3001 by default, while the client runs on port 3000. This setup allows for easy development and testing of the full-stack application.

## Next Steps

- [ ] Implement product management
- [ ] Add user authentication
- [ ] Implement shopping cart logic
- [ ] Add database integration
- [ ] Set up payment processing

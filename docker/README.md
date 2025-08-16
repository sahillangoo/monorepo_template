# Docker Setup for E-commerce Monorepo

This directory contains Docker configurations for running the e-commerce application in both development and production environments.

## 🏗️ Architecture

The Docker setup includes:

- **Client**: Next.js frontend application
- **Server**: Hono backend API with Prisma
- **Database**: PostgreSQL for data storage
- **Cache**: Redis for sessions and caching
- **Proxy**: Nginx for production reverse proxy and SSL termination

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB of available RAM
- Ports 3001, 3001, 5432, 6379 available

### Development Environment

1. **Copy environment file:**

   ```bash
   cp env.dev.example .env.dev
   # Edit .env.dev with your actual values
   ```

2. **Start development environment:**

   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up -d

   # View logs
   docker-compose -f docker-compose.dev.yml logs -f

   # Stop services
   docker-compose -f docker-compose.dev.yml down
   ```

3. **Access services:**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/docs
   - Prisma Studio: http://localhost:5555
   - Database: localhost:5432
   - Redis: localhost:6379

### Production Environment

1. **Copy environment file:**

   ```bash
   cp env.prod.example .env.prod
   # Edit .env.prod with your production values
   ```

2. **Set up SSL certificates:**

   ```bash
   mkdir -p nginx/ssl
   # Place your SSL certificates in nginx/ssl/
   # - cert.pem (SSL certificate)
   # - key.pem (Private key)
   ```

3. **Start production environment:**

   ```bash
   # Load environment variables
   export $(cat .env.prod | xargs)

   # Start all services
   docker-compose -f docker-compose.prod.yml up -d

   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   ```

4. **Access production services:**
   - Frontend: https://yourdomain.com
   - Backend API: https://yourdomain.com/api
   - API Docs: https://yourdomain.com/docs

## 🛠️ Available Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start specific service
docker-compose -f docker-compose.dev.yml up -d server

# View logs
docker-compose -f docker-compose.dev.yml logs -f server

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec server bun run db:migrate
docker-compose -f docker-compose.dev.yml exec client bun run build

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

### Production

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale server=3

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Database Management

### Development

```bash
# Access PostgreSQL
docker-compose -f docker-compose.dev.yml exec postgres psql -U ecommerce_user -d ecommerce_dev

# Run migrations
docker-compose -f docker-compose.dev.yml exec server bun run db:migrate

# Seed database
docker-compose -f docker-compose.dev.yml exec server bun run db:seed

# Reset database
docker-compose -f docker-compose.dev.yml exec server bun run db:reset

# Open Prisma Studio
# Visit http://localhost:5555
```

### Production

```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U ecommerce_user -d ecommerce_prod

# Run migrations
docker-compose -f docker-compose.prod.yml exec server bun run db:migrate

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ecommerce_user ecommerce_prod > backup.sql
```

## 📊 Monitoring and Logs

### View all logs

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### View specific service logs

```bash
docker-compose -f docker-compose.dev.yml logs -f server
docker-compose -f docker-compose.dev.yml logs -f client
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Container status

```bash
docker-compose -f docker-compose.dev.yml ps
```

## 🔒 Security Considerations

### Development

- Uses default passwords (change in production)
- Exposes all ports locally
- No SSL encryption

### Production

- Use strong, unique passwords
- SSL/TLS encryption with Nginx
- Rate limiting on API endpoints
- Security headers enabled
- Container resource limits
- Health checks enabled

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts:**

   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :3001
   lsof -i :5432
   ```

2. **Database connection issues:**

   ```bash
   # Check database health
   docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U ecommerce_user
   ```

3. **Container won't start:**

   ```bash
   # Check container logs
   docker-compose -f docker-compose.dev.yml logs service_name

   # Check container status
   docker-compose -f docker-compose.dev.yml ps -a
   ```

4. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker system prune -a

# Rebuild and start
docker-compose -f docker-compose.dev.yml up -d --build
```

## 📝 Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe secret key
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay secret key

### Optional Variables

- `REDIS_URL`: Redis connection string
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `DOMAIN`: Production domain name

## 🔄 Updates and Maintenance

### Update Dependencies

```bash
# Pull latest images
docker-compose -f docker-compose.dev.yml pull

# Rebuild with latest dependencies
docker-compose -f docker-compose.dev.yml up -d --build
```

### Backup and Restore

```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ecommerce_user ecommerce_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U ecommerce_user -d ecommerce_prod < backup.sql
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

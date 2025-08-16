# 🐳 Docker Setup Complete!

Your e-commerce monorepo now has a complete Docker infrastructure for both development and production environments.

## 🏗️ What's Been Created

### **Docker Files**

- `Dockerfile.client` - Multi-stage build for Next.js frontend
- `Dockerfile.server` - Multi-stage build for Hono backend
- `Dockerfile.dev` - Development environment with hot reloading
- `docker-compose.dev.yml` - Development services orchestration
- `docker-compose.prod.yml` - Production services orchestration

### **Configuration Files**

- `nginx/nginx.conf` - Production reverse proxy with SSL support
- `.dockerignore` - Optimized Docker builds
- `env.dev.example` - Development environment template
- `env.prod.example` - Production environment template

### **Management Scripts**

- `docker.sh` - Main Docker management script
- `docker/scripts/dev.sh` - Development environment management
- `docker/scripts/prod.sh` - Production environment management
- `Makefile` - Convenience commands

## 🚀 Quick Start

### **1. Prerequisites**

```bash
# Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Start Docker Desktop or Docker daemon
```

### **2. Initial Setup**

```bash
# Copy environment files
cp env.dev.example .env.dev
cp env.prod.example .env.prod

# Edit the files with your actual values
nano .env.dev
nano .env.prod
```

### **3. Start Development Environment**

```bash
# Using the main script
./docker.sh start

# Or using Make
make quick-start

# Or using the dev script directly
./docker/scripts/dev.sh start
```

### **4. Start Production Environment**

```bash
# Using the main script
./docker.sh prod start

# Or using Make
make prod-start
```

## 🛠️ Available Commands

### **Main Docker Script (`./docker.sh`)**

```bash
# Development (default)
./docker.sh start              # Start development
./docker.sh stop               # Stop development
./docker.sh logs               # Show logs
./docker.sh status             # Show status

# Production
./docker.sh prod start         # Start production
./docker.sh prod stop          # Stop production
./docker.sh prod logs          # Show production logs
./docker.sh prod scale server 3 # Scale server to 3 instances

# Help
./docker.sh help               # Show help
```

### **Make Commands**

```bash
make help                      # Show all available commands
make quick-start               # Setup and start development
make dev-start                 # Start development
make dev-stop                  # Stop development
make prod-start                # Start production
make prod-stop                 # Stop production
make db-migrate                # Run database migrations
make db-seed                   # Seed database
make db-studio                 # Open Prisma Studio
```

### **Direct Script Usage**

```bash
# Development
./docker/scripts/dev.sh start
./docker/scripts/dev.sh logs server
./docker/scripts/dev.sh exec server 'bun run db:migrate'

# Production
./docker/scripts/prod.sh start
./docker/scripts/prod.sh backup
./docker/scripts/prod.sh scale server 3
```

## 🌐 Service Access

### **Development Environment**

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs
- **Prisma Studio**: http://localhost:5555
- **Database**: localhost:5432
- **Redis**: localhost:6379

### **Production Environment**

- **Frontend**: https://yourdomain.com
- **Backend API**: https://yourdomain.com/api
- **API Docs**: https://yourdomain.com/docs
- **Database**: Internal network only
- **Redis**: Internal network only

## 🔧 Development Workflow

### **1. Start Development**

```bash
./docker.sh start
```

### **2. View Logs**

```bash
# All services
./docker.sh logs

# Specific service
./docker.sh logs server
./docker.sh logs client
```

### **3. Execute Commands in Containers**

```bash
# Run database migration
./docker.sh exec server 'bun run db:migrate'

# Seed database
./docker.sh exec server 'bun run db:seed'

# Open database shell
./docker.sh exec postgres psql -U ecommerce_user -d ecommerce_dev
```

### **4. Rebuild After Changes**

```bash
./docker.sh rebuild
```

### **5. Stop Development**

```bash
./docker.sh stop
```

## 🚀 Production Deployment

### **1. Prepare SSL Certificates**

```bash
mkdir -p nginx/ssl
# Place your SSL certificates:
# - nginx/ssl/cert.pem (SSL certificate)
# - nginx/ssl/key.pem (Private key)
```

### **2. Configure Environment**

```bash
cp env.prod.example .env.prod
# Edit .env.prod with production values
nano .env.prod
```

### **3. Deploy**

```bash
./docker.sh prod start
```

### **4. Scale Services**

```bash
./docker.sh prod scale server 3
./docker.sh prod scale client 2
```

### **5. Monitor and Backup**

```bash
./docker.sh prod status
./docker.sh prod logs
./docker.sh prod backup
```

## 🔒 Security Features

### **Development**

- Local network access only
- Default passwords (change in production)
- No SSL encryption

### **Production**

- SSL/TLS encryption with Nginx
- Rate limiting on API endpoints
- Security headers enabled
- Container resource limits
- Health checks enabled
- Internal network isolation

## 📊 Monitoring and Maintenance

### **Health Checks**

```bash
# Check service status
./docker.sh status
./docker.sh prod status

# View logs
./docker.sh logs
./docker.sh prod logs
```

### **Database Management**

```bash
# Run migrations
./docker.sh exec server 'bun run db:migrate'

# Create backup
./docker.sh prod backup

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U ecommerce_user -d ecommerce_prod < backup.sql
```

### **Updates**

```bash
# Update production services
./docker.sh prod update

# Rebuild development
./docker.sh rebuild
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Port Conflicts**

   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :3001
   lsof -i :5432
   ```

2. **Container Won't Start**

   ```bash
   # Check logs
   ./docker.sh logs

   # Check status
   ./docker.sh status
   ```

3. **Database Connection Issues**

   ```bash
   # Check database health
   ./docker.sh exec postgres pg_isready -U ecommerce_user
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### **Reset Everything**

```bash
# Stop all containers
./docker.sh stop
./docker.sh prod stop

# Clean up
./docker.sh cleanup
make clean

# Rebuild and start
./docker.sh rebuild
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)

## 🎉 You're Ready!

Your Docker infrastructure is now complete and ready to use. Start with:

```bash
# Quick start
make quick-start

# Or step by step
./docker.sh start
```

Happy coding! 🚀

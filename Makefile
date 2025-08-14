# Makefile for E-commerce Monorepo Docker Management

.PHONY: help dev-start dev-stop dev-logs dev-status dev-rebuild dev-cleanup \
        prod-start prod-stop prod-logs prod-status prod-scale prod-update prod-backup \
        setup clean

# Default target
help:
	@echo "E-commerce Monorepo Docker Management"
	@echo "===================================="
	@echo ""
	@echo "Development Commands:"
	@echo "  dev-start     Start development environment"
	@echo "  dev-stop      Stop development environment"
	@echo "  dev-logs      Show development logs"
	@echo "  dev-status    Show development status"
	@echo "  dev-rebuild   Rebuild development environment"
	@echo "  dev-cleanup   Clean up development environment"
	@echo ""
	@echo "Production Commands:"
	@echo "  prod-start    Start production environment"
	@echo "  prod-stop     Stop production environment"
	@echo "  prod-logs     Show production logs"
	@echo "  prod-status   Show production status"
	@echo "  prod-scale    Scale production services"
	@echo "  prod-update   Update production services"
	@echo "  prod-backup   Create database backup"
	@echo ""
	@echo "Utility Commands:"
	@echo "  setup         Initial setup (copy env files)"
	@echo "  clean         Clean all Docker resources"
	@echo "  help          Show this help message"

# Development commands
dev-start:
	@echo "Starting development environment..."
	./docker.sh dev start

dev-stop:
	@echo "Stopping development environment..."
	./docker.sh dev stop

dev-logs:
	@echo "Showing development logs..."
	./docker.sh dev logs

dev-status:
	@echo "Showing development status..."
	./docker.sh dev status

dev-rebuild:
	@echo "Rebuilding development environment..."
	./docker.sh dev rebuild

dev-cleanup:
	@echo "Cleaning up development environment..."
	./docker.sh dev cleanup

# Production commands
prod-start:
	@echo "Starting production environment..."
	./docker.sh prod start

prod-stop:
	@echo "Stopping production environment..."
	./docker.sh prod stop

prod-logs:
	@echo "Showing production logs..."
	./docker.sh prod logs

prod-status:
	@echo "Showing production status..."
	./docker.sh prod status

prod-scale:
	@echo "Scaling production services..."
	@read -p "Enter service name: " service; \
	read -p "Enter number of instances: " count; \
	./docker.sh prod scale $$service $$count

prod-update:
	@echo "Updating production services..."
	./docker.sh prod update

prod-backup:
	@echo "Creating database backup..."
	./docker.sh prod backup

# Utility commands
setup:
	@echo "Setting up environment files..."
	@if [ ! -f .env.dev ]; then \
		cp env.dev.example .env.dev; \
		echo "Created .env.dev from example"; \
	else \
		echo ".env.dev already exists"; \
	fi
	@if [ ! -f .env.prod ]; then \
		cp env.prod.example .env.prod; \
		echo "Created .env.prod from example"; \
	else \
		echo ".env.prod already exists"; \
	fi
	@echo "Please edit .env.dev and .env.prod with your actual values"

clean:
	@echo "Cleaning all Docker resources..."
	docker system prune -a -f --volumes
	@echo "Cleanup completed"

# Database commands
db-migrate:
	@echo "Running database migrations..."
	./docker.sh dev exec server 'bun run db:migrate'

db-seed:
	@echo "Seeding database..."
	./docker.sh dev exec server 'bun run db:seed'

db-studio:
	@echo "Opening Prisma Studio..."
	@echo "Visit: http://localhost:5555"
	./docker.sh dev exec server 'bun run db:studio'

# Quick start commands
quick-start: setup dev-start
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001"
	@echo "API Docs: http://localhost:3001/docs"
	@echo "Prisma Studio: http://localhost:5555"

quick-stop: dev-stop
	@echo "Development environment stopped!"

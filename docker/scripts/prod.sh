#!/bin/bash

# Production Docker Management Script
# Usage: ./prod.sh [command]

set -e

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if environment file exists
check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file $ENV_FILE not found."
        print_status "Please create $ENV_FILE from env.prod.example and fill in your production values."
        exit 1
    fi
}

# Function to check SSL certificates
check_ssl() {
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        print_warning "SSL certificates not found in nginx/ssl/"
        print_status "Please place your SSL certificates in nginx/ssl/:"
        echo "  - nginx/ssl/cert.pem (SSL certificate)"
        echo "  - nginx/ssl/key.pem (Private key)"
        print_warning "Continuing without SSL (HTTP only)..."
    else
        print_success "SSL certificates found"
    fi
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    export $(cat "$ENV_FILE" | xargs)
    docker-compose -f "$COMPOSE_FILE" up -d
    print_success "Production environment started!"
    print_status "Services available at:"
    echo "  - Frontend: https://${DOMAIN:-localhost}"
    echo "  - Backend API: https://${DOMAIN:-localhost}/api"
    echo "  - API Docs: https://${DOMAIN:-localhost}/docs"
}

# Function to stop production environment
stop_prod() {
    print_status "Stopping production environment..."
    docker-compose -f "$COMPOSE_FILE" down
    print_success "Production environment stopped!"
}

# Function to restart production environment
restart_prod() {
    print_status "Restarting production environment..."
    docker-compose -f "$COMPOSE_FILE" restart
    print_success "Production environment restarted!"
}

# Function to view logs
logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        print_status "Showing logs for service: $1"
        docker-compose -f "$COMPOSE_FILE" logs -f "$1"
    fi
}

# Function to show status
status() {
    print_status "Production environment status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Function to scale services
scale() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        print_error "Usage: $0 scale <service> <count>"
        exit 1
    fi
    print_status "Scaling $1 to $2 instances..."
    docker-compose -f "$COMPOSE_FILE" up -d --scale "$1=$2"
    print_success "Scaled $1 to $2 instances!"
}

# Function to update services
update() {
    print_status "Updating production services..."
    docker-compose -f "$COMPOSE_FILE" pull
    docker-compose -f "$COMPOSE_FILE" up -d
    print_success "Production services updated!"
}

# Function to backup database
backup() {
    print_status "Creating database backup..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_${TIMESTAMP}.sql"
    docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U ecommerce_user ecommerce_prod > "$BACKUP_FILE"
    print_success "Database backup created: $BACKUP_FILE"
}

# Function to show help
show_help() {
    echo "Production Docker Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start production environment"
    echo "  stop      Stop production environment"
    echo "  restart   Restart production environment"
    echo "  logs      Show logs (all services or specific service)"
    echo "  status    Show container status"
    echo "  scale     Scale service to specified number of instances"
    echo "  update    Update and restart services"
    echo "  backup    Create database backup"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs server"
    echo "  $0 scale server 3"
    echo "  $0 backup"
}

# Main script logic
main() {
    check_docker
    check_env
    check_ssl

    case "${1:-help}" in
        start)
            start_prod
            ;;
        stop)
            stop_prod
            ;;
        restart)
            restart_prod
            ;;
        logs)
            logs "$2"
            ;;
        status)
            status
            ;;
        scale)
            scale "$2" "$3"
            ;;
        update)
            update
            ;;
        backup)
            backup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

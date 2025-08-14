#!/bin/bash

# Development Docker Management Script
# Usage: ./dev.sh [command]

set -e

COMPOSE_FILE="docker-compose.dev.yml"
ENV_FILE=".env.dev"

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
        print_warning "Environment file $ENV_FILE not found."
        print_status "Creating from example..."
        if [ -f "env.dev.example" ]; then
            cp env.dev.example "$ENV_FILE"
            print_success "Created $ENV_FILE from example. Please edit it with your values."
        else
            print_error "env.dev.example not found. Please create $ENV_FILE manually."
            exit 1
        fi
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose -f "$COMPOSE_FILE" up -d
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:3001"
    echo "  - API Docs: http://localhost:3001/docs"
    echo "  - Prisma Studio: http://localhost:5555"
    echo "  - Database: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose -f "$COMPOSE_FILE" down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    docker-compose -f "$COMPOSE_FILE" restart
    print_success "Development environment restarted!"
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

# Function to execute command in container
exec_cmd() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        print_error "Usage: $0 exec <service> <command>"
        exit 1
    fi
    print_status "Executing command in $1: $2"
    docker-compose -f "$COMPOSE_FILE" exec "$1" sh -c "$2"
}

# Function to show status
status() {
    print_status "Development environment status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Function to rebuild and start
rebuild() {
    print_status "Rebuilding and starting development environment..."
    docker-compose -f "$COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" up -d --build
    print_success "Development environment rebuilt and started!"
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up development environment..."
        docker-compose -f "$COMPOSE_FILE" down -v
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Development Docker Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start development environment"
    echo "  stop      Stop development environment"
    echo "  restart   Restart development environment"
    echo "  logs      Show logs (all services or specific service)"
    echo "  exec      Execute command in container"
    echo "  status    Show container status"
    echo "  rebuild   Rebuild and start environment"
    echo "  cleanup   Remove all containers, volumes, and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs server"
    echo "  $0 exec server 'bun run db:migrate'"
    echo "  $0 status"
}

# Main script logic
main() {
    check_docker
    check_env

    case "${1:-help}" in
        start)
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        logs)
            logs "$2"
            ;;
        exec)
            exec_cmd "$2" "$3"
            ;;
        status)
            status
            ;;
        rebuild)
            rebuild
            ;;
        cleanup)
            cleanup
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

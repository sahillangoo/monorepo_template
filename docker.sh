#!/bin/bash

# Main Docker Management Script for E-commerce Monorepo
# Usage: ./docker.sh [environment] [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  E-commerce Docker Manager${NC}"
    echo -e "${PURPLE}================================${NC}"
}

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

# Function to show help
show_help() {
    print_header
    echo ""
    echo "Usage: $0 [environment] [command]"
    echo ""
    echo "Environments:"
    echo "  dev       Development environment (default)"
    echo "  prod      Production environment"
    echo ""
    echo "Commands:"
    echo "  start     Start environment"
    echo "  stop      Stop environment"
    echo "  restart   Restart environment"
    echo "  logs      Show logs (all services or specific service)"
    echo "  exec      Execute command in container"
    echo "  status    Show container status"
    echo "  rebuild   Rebuild and start environment (dev only)"
    echo "  cleanup   Remove all containers, volumes, and images (dev only)"
    echo "  scale     Scale service to specified number of instances (prod only)"
    echo "  update    Update and restart services (prod only)"
    echo "  backup    Create database backup (prod only)"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start development environment"
    echo "  $0 dev start          # Start development environment"
    echo "  $0 prod start         # Start production environment"
    echo "  $0 dev logs server    # Show server logs in dev"
    echo "  $0 prod scale server 3 # Scale server to 3 instances in prod"
    echo "  $0 dev exec server 'bun run db:migrate'"
    echo ""
    echo "Quick Start:"
    echo "  1. Copy environment files:"
    echo "     cp env.dev.example .env.dev"
    echo "     cp env.prod.example .env.prod"
    echo "  2. Edit .env.dev and .env.prod with your values"
    echo "  3. Start development: $0 start"
    echo "  4. Start production: $0 prod start"
}

# Function to run development commands
run_dev() {
    local command="$1"
    shift
    ./docker/scripts/dev.sh "$command" "$@"
}

# Function to run production commands
run_prod() {
    local command="$1"
    shift
    ./docker/scripts/prod.sh "$command" "$@"
}

# Main script logic
main() {
    check_docker

    # Default to development if no environment specified
    local environment="dev"
    local command="help"

    # Parse arguments
    if [ $# -eq 0 ]; then
        # No arguments, show help
        show_help
        exit 0
    elif [ $# -eq 1 ]; then
        # One argument - could be environment or command
        if [[ "$1" =~ ^(dev|prod)$ ]]; then
            # It's an environment, default to help
            environment="$1"
            command="help"
        else
            # It's a command, default to dev environment
            command="$1"
        fi
    else
        # Two or more arguments
        if [[ "$1" =~ ^(dev|prod)$ ]]; then
            # First argument is environment
            environment="$1"
            command="$2"
            shift 2
        else
            # First argument is command, default to dev environment
            command="$1"
            shift
        fi
    fi

    # Handle help command
    if [[ "$command" =~ ^(help|--help|-h)$ ]]; then
        show_help
        exit 0
    fi

    # Run the appropriate script
    case "$environment" in
        dev)
            print_status "Running development command: $command"
            run_dev "$command" "$@"
            ;;
        prod)
            print_status "Running production command: $command"
            run_prod "$command" "$@"
            ;;
        *)
            print_error "Invalid environment: $environment"
            print_status "Valid environments: dev, prod"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

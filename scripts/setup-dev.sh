#!/bin/bash

# ==============================================
# Jobifies Development Environment Setup
# ==============================================
# Comprehensive setup script for development environment
# This script prepares everything needed for local development

set -e # Exit on any error

# ==============================================
# CONFIGURATION
# ==============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================
# FUNCTIONS
# ==============================================

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node_version() {
    if ! command_exists node; then
        error "Node.js is not installed. Please install Node.js 18 or later."
    fi

    local node_version
    node_version=$(node -v | sed 's/v//')
    local major_version
    major_version=$(echo "$node_version" | cut -d. -f1)

    if [ "$major_version" -lt 18 ]; then
        error "Node.js version $node_version is not supported. Please install Node.js 18 or later."
    fi

    success "Node.js version $node_version is supported"
}

# Check npm version
check_npm_version() {
    if ! command_exists npm; then
        error "npm is not installed. Please install npm."
    fi

    local npm_version
    npm_version=$(npm -v)
    success "npm version $npm_version"
}

# Install system dependencies
install_system_dependencies() {
    log "Checking system dependencies..."

    # Check for Docker
    if ! command_exists docker; then
        warning "Docker is not installed. You'll need Docker for local development."
        warning "Please install Docker from: https://www.docker.com/get-started"
    else
        success "Docker is available"
    fi

    # Check for Docker Compose
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        warning "Docker Compose is not installed. You'll need Docker Compose for local development."
    else
        success "Docker Compose is available"
    fi

    # Check for Git
    if ! command_exists git; then
        error "Git is not installed. Please install Git."
    else
        success "Git is available"
    fi

    # Platform-specific dependencies
    case "$(uname -s)" in
        Darwin*)
            log "macOS detected"
            if ! command_exists brew; then
                warning "Homebrew is not installed. Consider installing it for easier package management."
                warning "Install from: https://brew.sh"
            fi
            ;;
        Linux*)
            log "Linux detected"
            # Check for common package managers
            if command_exists apt-get; then
                log "Using apt package manager"
            elif command_exists yum; then
                log "Using yum package manager"
            elif command_exists pacman; then
                log "Using pacman package manager"
            fi
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            log "Windows detected"
            warning "For best development experience on Windows, consider using WSL2"
            ;;
        *)
            warning "Unknown operating system: $(uname -s)"
            ;;
    esac
}

# Setup project structure
setup_project_structure() {
    log "Setting up project structure..."

    cd "$PROJECT_ROOT"

    # Create necessary directories
    local directories=(
        "logs"
        "uploads/company-logos"
        "uploads/profile-pictures"
        "uploads/resumes"
        "cache/optimized"
        "config/secrets"
        "tests/e2e/screenshots"
        "tests/performance/results"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log "Created directory: $dir"
        fi
    done

    # Create .gitkeep files for empty directories that should be tracked
    local gitkeep_dirs=(
        "logs"
        "uploads/company-logos"
        "uploads/profile-pictures"
        "uploads/resumes"
        "cache"
        "tests/e2e/screenshots"
        "tests/performance/results"
    )

    for dir in "${gitkeep_dirs[@]}"; do
        if [ -d "$dir" ] && [ ! -f "$dir/.gitkeep" ]; then
            touch "$dir/.gitkeep"
        fi
    done

    success "Project structure setup completed"
}

# Install project dependencies
install_dependencies() {
    log "Installing project dependencies..."

    cd "$PROJECT_ROOT"

    # Install root dependencies
    log "Installing root dependencies..."
    npm ci

    # Install frontend dependencies
    log "Installing frontend dependencies..."
    cd frontend
    npm ci
    cd ..

    # Install backend dependencies
    log "Installing backend dependencies..."
    cd backend
    npm ci
    cd ..

    success "All dependencies installed"
}

# Setup environment files
setup_environment_files() {
    log "Setting up environment files..."

    cd "$PROJECT_ROOT"

    # Check if .env files exist
    local env_files=(".env.development" ".env.test")
    
    for env_file in "${env_files[@]}"; do
        if [ ! -f "$env_file" ]; then
            log "Creating $env_file from template..."
            if [ -f ".env.example" ]; then
                cp ".env.example" "$env_file"
                success "Created $env_file"
            else
                warning ".env.example not found, creating basic $env_file"
                cat > "$env_file" << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://jobifies:jobifies123@localhost:5432/jobifies_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production
SESSION_SECRET=dev-session-secret-change-in-production
CORS_ORIGIN=http://localhost:3000
EOF
            fi
        else
            success "$env_file already exists"
        fi
    done

    # Generate secure secrets for development if needed
    if command_exists openssl; then
        log "Generating secure development secrets..."
        
        # Update JWT secret
        local jwt_secret
        jwt_secret=$(openssl rand -base64 32)
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$jwt_secret/" .env.development 2>/dev/null || true
        
        # Update session secret
        local session_secret
        session_secret=$(openssl rand -hex 32)
        sed -i.bak "s/SESSION_SECRET=.*/SESSION_SECRET=$session_secret/" .env.development 2>/dev/null || true
        
        # Clean up backup files
        rm -f .env.development.bak 2>/dev/null || true
        
        success "Generated secure development secrets"
    fi
}

# Setup Git hooks
setup_git_hooks() {
    log "Setting up Git hooks..."

    cd "$PROJECT_ROOT"

    # Check if we're in a Git repository
    if [ ! -d ".git" ]; then
        warning "Not a Git repository. Skipping Git hooks setup."
        return
    fi

    # Install husky if it exists in package.json
    if grep -q "husky" package.json 2>/dev/null; then
        log "Setting up Husky Git hooks..."
        npx husky install
        success "Git hooks setup completed"
    else
        log "Husky not found in dependencies, skipping Git hooks"
    fi
}

# Setup database
setup_database() {
    log "Setting up database..."

    cd "$PROJECT_ROOT/backend"

    # Check if Docker is running
    if command_exists docker && docker info >/dev/null 2>&1; then
        log "Starting database services with Docker..."
        cd "$PROJECT_ROOT"
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        log "Waiting for database to be ready..."
        sleep 10
        
        # Run migrations
        log "Running database migrations..."
        cd backend
        npm run migrate || warning "Database migration failed - database might not be ready yet"
        
        # Run seeds
        log "Seeding database with initial data..."
        npm run seed || warning "Database seeding failed - check if migrations completed successfully"
        
        success "Database setup completed"
    else
        warning "Docker is not running. Please start Docker and run database setup manually:"
        warning "  docker-compose up -d postgres redis"
        warning "  cd backend && npm run migrate && npm run seed"
    fi
}

# Verify setup
verify_setup() {
    log "Verifying development environment setup..."

    cd "$PROJECT_ROOT"

    local errors=0

    # Check environment files
    if [ ! -f ".env.development" ]; then
        error "Environment file .env.development not found"
        errors=$((errors + 1))
    fi

    # Check if node_modules exist
    if [ ! -d "node_modules" ]; then
        error "Root node_modules not found"
        errors=$((errors + 1))
    fi

    if [ ! -d "frontend/node_modules" ]; then
        error "Frontend node_modules not found"
        errors=$((errors + 1))
    fi

    if [ ! -d "backend/node_modules" ]; then
        error "Backend node_modules not found"
        errors=$((errors + 1))
    fi

    # Test frontend build
    log "Testing frontend build..."
    cd frontend
    if npm run build >/dev/null 2>&1; then
        success "Frontend builds successfully"
    else
        warning "Frontend build failed"
        errors=$((errors + 1))
    fi
    cd ..

    # Test backend build
    log "Testing backend build..."
    cd backend
    if npm run build >/dev/null 2>&1; then
        success "Backend builds successfully"
    else
        warning "Backend build failed"
        errors=$((errors + 1))
    fi
    cd ..

    # Test database connection (if Docker is running)
    if command_exists docker && docker info >/dev/null 2>&1; then
        log "Testing database connection..."
        cd backend
        if node database/cli.js test >/dev/null 2>&1; then
            success "Database connection successful"
        else
            warning "Database connection failed"
            errors=$((errors + 1))
        fi
        cd ..
    fi

    if [ $errors -eq 0 ]; then
        success "All verification checks passed"
    else
        warning "$errors verification checks failed"
    fi

    return $errors
}

# Print development instructions
print_instructions() {
    echo ""
    echo "🎉 Development environment setup completed!"
    echo ""
    echo "📋 Quick Start Commands:"
    echo "  Start all services:      docker-compose up"
    echo "  Start frontend only:     cd frontend && npm run dev"
    echo "  Start backend only:      cd backend && npm run dev"
    echo "  Run all tests:          npm test"
    echo "  Database CLI:           cd backend && node database/cli.js"
    echo ""
    echo "🌐 Local URLs:"
    echo "  Frontend:               http://localhost:3000"
    echo "  Backend API:            http://localhost:5000"
    echo "  API Documentation:      http://localhost:5000/api-docs"
    echo "  Database Admin:         http://localhost:8080 (pgAdmin)"
    echo "  Email Testing:          http://localhost:8025 (MailHog)"
    echo "  Monitoring:             http://localhost:3001 (Grafana)"
    echo ""
    echo "📚 Useful Commands:"
    echo "  Generate environment:   npm run setup:env"
    echo "  Database migrations:    cd backend && npm run migrate"
    echo "  Database reset:         cd backend && node database/cli.js reset"
    echo "  Run load tests:         npm run test:load"
    echo "  Deploy to staging:      ./scripts/deploy.sh staging"
    echo ""
    echo "⚠️  Important Notes:"
    echo "  - Environment variables are in .env.development"
    echo "  - Never commit .env files to version control"
    echo "  - Use 'npm run setup:secrets' to generate secure secrets"
    echo "  - Check logs/ directory for application logs"
    echo ""
    echo "🐛 Troubleshooting:"
    echo "  - If database connection fails, run: docker-compose restart postgres"
    echo "  - If port conflicts occur, check what's running on ports 3000, 5000, 5432, 6379"
    echo "  - For permission issues, ensure Docker daemon is running"
    echo "  - View container logs with: docker-compose logs [service-name]"
    echo ""
}

# Show usage
show_usage() {
    cat << EOF
Jobifies Development Environment Setup

Usage: $0 [options]

Options:
  --skip-deps      Skip dependency installation
  --skip-db        Skip database setup
  --skip-docker    Skip Docker-related setup
  --verify-only    Only run verification checks
  -h, --help       Show this help message

Examples:
  $0                     # Full setup
  $0 --skip-deps         # Setup without installing dependencies
  $0 --verify-only       # Only verify existing setup

EOF
}

# ==============================================
# MAIN SETUP FLOW
# ==============================================

main() {
    local skip_deps=false
    local skip_db=false
    local skip_docker=false
    local verify_only=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-deps)
                skip_deps=true
                shift
                ;;
            --skip-db)
                skip_db=true
                shift
                ;;
            --skip-docker)
                skip_docker=true
                shift
                ;;
            --verify-only)
                verify_only=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done

    log "Starting Jobifies development environment setup..."

    if [ "$verify_only" = true ]; then
        verify_setup
        exit $?
    fi

    # Pre-setup checks
    check_node_version
    check_npm_version
    install_system_dependencies

    # Main setup
    setup_project_structure
    
    if [ "$skip_deps" = false ]; then
        install_dependencies
    fi
    
    setup_environment_files
    setup_git_hooks
    
    if [ "$skip_db" = false ] && [ "$skip_docker" = false ]; then
        setup_database
    fi

    # Verification
    if ! verify_setup; then
        warning "Some verification checks failed, but setup completed"
    fi

    print_instructions
    success "Development environment setup completed! 🚀"
}

# Run main function
main "$@"
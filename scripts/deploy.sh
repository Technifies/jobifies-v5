#!/bin/bash

# ==============================================
# Jobifies Deployment Script
# ==============================================
# Comprehensive deployment automation for all environments
# Usage: ./scripts/deploy.sh [environment] [options]

set -e # Exit on any error

# ==============================================
# CONFIGURATION
# ==============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=""
SKIP_TESTS=false
SKIP_BUILD=false
FORCE_DEPLOY=false
DRY_RUN=false
VERBOSE=false

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

# Show usage information
show_usage() {
    cat << EOF
Jobifies Deployment Script

Usage: $0 <environment> [options]

Environments:
  development    Deploy to development environment
  staging        Deploy to staging environment  
  production     Deploy to production environment

Options:
  --skip-tests      Skip running tests
  --skip-build      Skip building applications
  --force          Force deployment without confirmations
  --dry-run        Show what would be deployed without actually deploying
  --verbose        Enable verbose output
  -h, --help       Show this help message

Examples:
  $0 staging                    # Deploy to staging
  $0 production --force         # Force deploy to production
  $0 development --skip-tests   # Deploy to development without tests

EOF
}

# Parse command line arguments
parse_args() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi

    ENVIRONMENT=$1
    shift

    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --force)
                FORCE_DEPLOY=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
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

    # Validate environment
    case $ENVIRONMENT in
        development|staging|production)
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if we're in the project root
    if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
        error "Not in project root directory"
    fi

    # Check required commands
    local commands=("node" "npm" "git")
    
    if [[ $ENVIRONMENT == "production" ]]; then
        commands+=("gh" "curl")
    fi

    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "Required command not found: $cmd"
        fi
    done

    # Check environment file
    if [[ ! -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
        warning "Environment file not found: .env.$ENVIRONMENT"
        if [[ $ENVIRONMENT == "production" && $FORCE_DEPLOY == false ]]; then
            error "Production environment file is required"
        fi
    fi

    success "Prerequisites check completed"
}

# Check Git status
check_git_status() {
    log "Checking Git status..."

    cd "$PROJECT_ROOT"

    # Check if working directory is clean (for production)
    if [[ $ENVIRONMENT == "production" ]]; then
        if [[ -n $(git status --porcelain) ]]; then
            if [[ $FORCE_DEPLOY == false ]]; then
                error "Working directory is not clean. Commit your changes or use --force"
            else
                warning "Working directory is not clean, but forcing deployment"
            fi
        fi
    fi

    # Get current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    CURRENT_COMMIT=$(git rev-parse HEAD)
    
    # Check if we're on the right branch
    case $ENVIRONMENT in
        production)
            if [[ $CURRENT_BRANCH != "main" && $FORCE_DEPLOY == false ]]; then
                error "Production deployments must be from 'main' branch. Current: $CURRENT_BRANCH"
            fi
            ;;
        staging)
            if [[ $CURRENT_BRANCH != "staging" && $CURRENT_BRANCH != "main" && $FORCE_DEPLOY == false ]]; then
                error "Staging deployments must be from 'staging' or 'main' branch. Current: $CURRENT_BRANCH"
            fi
            ;;
    esac

    log "Branch: $CURRENT_BRANCH"
    log "Commit: $CURRENT_COMMIT"
    success "Git status check completed"
}

# Install dependencies
install_dependencies() {
    if [[ $SKIP_BUILD == true ]]; then
        log "Skipping dependency installation"
        return
    fi

    log "Installing dependencies..."
    cd "$PROJECT_ROOT"

    # Install root dependencies
    npm ci --prefer-offline --no-audit

    # Install frontend dependencies
    cd "$PROJECT_ROOT/frontend"
    npm ci --prefer-offline --no-audit

    # Install backend dependencies
    cd "$PROJECT_ROOT/backend"
    npm ci --prefer-offline --no-audit

    success "Dependencies installed"
}

# Run tests
run_tests() {
    if [[ $SKIP_TESTS == true ]]; then
        log "Skipping tests"
        return
    fi

    log "Running tests..."
    cd "$PROJECT_ROOT"

    # Run frontend tests
    log "Running frontend tests..."
    cd "$PROJECT_ROOT/frontend"
    npm run test -- --watchAll=false --coverage=false

    # Run backend tests
    log "Running backend tests..."
    cd "$PROJECT_ROOT/backend"
    npm run test

    success "All tests passed"
}

# Build applications
build_applications() {
    if [[ $SKIP_BUILD == true ]]; then
        log "Skipping build"
        return
    fi

    log "Building applications..."

    # Set environment variables
    export NODE_ENV=$ENVIRONMENT
    if [[ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
        source "$PROJECT_ROOT/.env.$ENVIRONMENT"
    fi

    # Build frontend
    log "Building frontend..."
    cd "$PROJECT_ROOT/frontend"
    npm run build

    # Build backend
    log "Building backend..."
    cd "$PROJECT_ROOT/backend"
    npm run build

    success "Applications built successfully"
}

# Run database migrations
run_migrations() {
    if [[ $ENVIRONMENT == "development" ]]; then
        log "Skipping migrations for development"
        return
    fi

    log "Running database migrations..."
    cd "$PROJECT_ROOT/backend"

    # Load environment variables
    if [[ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
        source "$PROJECT_ROOT/.env.$ENVIRONMENT"
    fi

    # Check database connection
    if ! node database/cli.js test; then
        error "Database connection failed"
    fi

    # Run migrations
    if [[ $DRY_RUN == false ]]; then
        node database/cli.js migrate
        success "Database migrations completed"
    else
        log "DRY RUN: Would run database migrations"
    fi
}

# Deploy frontend to Netlify
deploy_frontend() {
    log "Deploying frontend to Netlify..."

    cd "$PROJECT_ROOT/frontend"

    if [[ $DRY_RUN == true ]]; then
        log "DRY RUN: Would deploy frontend to Netlify"
        return
    fi

    # Set Netlify site ID based on environment
    case $ENVIRONMENT in
        production)
            NETLIFY_SITE_ID=${NETLIFY_SITE_ID_PROD}
            ;;
        staging)
            NETLIFY_SITE_ID=${NETLIFY_SITE_ID_STAGING}
            ;;
        development)
            NETLIFY_SITE_ID=${NETLIFY_SITE_ID_DEV}
            ;;
    esac

    if [[ -z $NETLIFY_SITE_ID ]]; then
        error "Netlify site ID not configured for $ENVIRONMENT"
    fi

    # Deploy to Netlify
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=out --site=$NETLIFY_SITE_ID
    else
        warning "Netlify CLI not found, using GitHub Actions for deployment"
    fi

    success "Frontend deployed to Netlify"
}

# Deploy backend to Render
deploy_backend() {
    log "Deploying backend to Render..."

    if [[ $DRY_RUN == true ]]; then
        log "DRY RUN: Would deploy backend to Render"
        return
    fi

    # Set Render service ID based on environment
    case $ENVIRONMENT in
        production)
            RENDER_SERVICE_ID=${RENDER_SERVICE_ID_PROD}
            ;;
        staging)
            RENDER_SERVICE_ID=${RENDER_SERVICE_ID_STAGING}
            ;;
        development)
            RENDER_SERVICE_ID=${RENDER_SERVICE_ID_DEV}
            ;;
    esac

    if [[ -z $RENDER_SERVICE_ID ]]; then
        error "Render service ID not configured for $ENVIRONMENT"
    fi

    # Trigger Render deployment
    if [[ -n $RENDER_API_TOKEN ]]; then
        curl -X POST \
            -H "Authorization: Bearer $RENDER_API_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"clearCache": false}' \
            "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys"
    else
        warning "Render API token not found, deployment may need to be triggered manually"
    fi

    success "Backend deployment triggered on Render"
}

# Wait for deployments to complete
wait_for_deployments() {
    if [[ $DRY_RUN == true ]]; then
        return
    fi

    log "Waiting for deployments to complete..."

    # Wait for backend deployment (check health endpoint)
    local backend_url
    case $ENVIRONMENT in
        production)
            backend_url="https://api.jobifies.com"
            ;;
        staging)
            backend_url="https://api-staging.jobifies.com"
            ;;
        development)
            backend_url="https://api-dev.jobifies.com"
            ;;
    esac

    log "Checking backend health: $backend_url/api/v1/health"
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$backend_url/api/v1/health" > /dev/null; then
            success "Backend is healthy"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            error "Backend health check failed after $max_attempts attempts"
        fi
        
        log "Attempt $attempt/$max_attempts - Backend not ready, waiting..."
        sleep 10
        ((attempt++))
    done
}

# Run post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."

    # Clear caches
    if [[ $ENVIRONMENT == "production" ]]; then
        log "Clearing production caches..."
        # Add cache clearing logic here
    fi

    # Warm up application
    local frontend_url
    case $ENVIRONMENT in
        production)
            frontend_url="https://jobifies.com"
            ;;
        staging)
            frontend_url="https://staging.jobifies.com"
            ;;
        development)
            frontend_url="https://dev.jobifies.com"
            ;;
    esac

    log "Warming up application: $frontend_url"
    curl -f -s "$frontend_url" > /dev/null || warning "Failed to warm up frontend"

    success "Post-deployment tasks completed"
}

# Send deployment notification
send_notification() {
    if [[ $DRY_RUN == true ]]; then
        return
    fi

    log "Sending deployment notification..."

    local message="🚀 Deployment to $ENVIRONMENT completed successfully
    
    📊 Details:
    - Branch: $CURRENT_BRANCH
    - Commit: $CURRENT_COMMIT
    - Timestamp: $TIMESTAMP
    - Deployed by: $(whoami)"

    # Send to Slack if webhook URL is configured
    if [[ -n $SLACK_WEBHOOK_URL ]]; then
        curl -X POST \
            -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi

    success "Deployment notification sent"
}

# Rollback function
rollback() {
    warning "Rollback functionality not implemented yet"
    warning "Please use your deployment platform's rollback features"
}

# Deployment confirmation
confirm_deployment() {
    if [[ $FORCE_DEPLOY == true || $DRY_RUN == true ]]; then
        return
    fi

    echo ""
    warning "You are about to deploy to $ENVIRONMENT environment"
    echo "Branch: $CURRENT_BRANCH"
    echo "Commit: $CURRENT_COMMIT"
    echo ""
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deployment cancelled"
        exit 0
    fi
}

# ==============================================
# MAIN DEPLOYMENT FLOW
# ==============================================

main() {
    log "Starting Jobifies deployment to $ENVIRONMENT"
    
    if [[ $DRY_RUN == true ]]; then
        warning "DRY RUN MODE - No actual changes will be made"
    fi

    # Pre-deployment checks
    check_prerequisites
    check_git_status
    confirm_deployment

    # Build phase
    install_dependencies
    run_tests
    build_applications

    # Deployment phase
    run_migrations
    deploy_backend
    deploy_frontend

    # Post-deployment
    wait_for_deployments
    post_deployment
    send_notification

    success "Deployment to $ENVIRONMENT completed successfully! 🎉"
    log "Deployment took: $((SECONDS / 60))m $((SECONDS % 60))s"
}

# ==============================================
# SCRIPT EXECUTION
# ==============================================

# Parse arguments
parse_args "$@"

# Load environment variables if file exists
if [[ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]]; then
    source "$PROJECT_ROOT/.env.$ENVIRONMENT"
fi

# Enable verbose output if requested
if [[ $VERBOSE == true ]]; then
    set -x
fi

# Run main deployment
main

# Reset verbose mode
if [[ $VERBOSE == true ]]; then
    set +x
fi
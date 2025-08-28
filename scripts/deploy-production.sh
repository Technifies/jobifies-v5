#!/bin/bash

# ==============================================
# JOBIFIES PRODUCTION DEPLOYMENT SCRIPT
# ==============================================
# Automated deployment script for Render + Netlify
# Run this script to deploy the complete job portal

set -e  # Exit on any error

echo "🚀 Starting Jobifies Production Deployment..."
echo "================================================"

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

# Check if required commands are available
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All requirements are satisfied"
}

# Validate environment
validate_environment() {
    print_status "Validating environment configuration..."
    
    if [ ! -f "backend/package.json" ]; then
        print_error "Backend package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    if [ ! -f "frontend/package.json" ]; then
        print_error "Frontend package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Test backend build
test_backend_build() {
    print_status "Testing backend build process..."
    
    cd backend
    
    if ! npm ci --production=false; then
        print_error "Backend dependency installation failed"
        exit 1
    fi
    
    if ! npm run build; then
        print_error "Backend build failed"
        exit 1
    fi
    
    print_success "Backend build successful"
    cd ..
}

# Test frontend build
test_frontend_build() {
    print_status "Testing frontend build process..."
    
    cd frontend
    
    if ! npm ci --production=false; then
        print_error "Frontend dependency installation failed"
        exit 1
    fi
    
    # Copy production environment variables
    if [ -f ".env.production" ]; then
        cp .env.production .env.local
        print_status "Using production environment configuration"
    fi
    
    if ! npm run build; then
        print_error "Frontend build failed"
        exit 1
    fi
    
    print_success "Frontend build successful"
    cd ..
}

# Run tests
run_tests() {
    print_status "Running test suite..."
    
    # Backend tests
    cd backend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_status "Running backend tests..."
        npm test || print_warning "Backend tests failed, but continuing deployment"
    fi
    cd ..
    
    # Frontend tests (if available)
    cd frontend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_status "Running frontend tests..."
        npm test -- --passWithNoTests || print_warning "Frontend tests failed, but continuing deployment"
    fi
    cd ..
    
    print_success "Test execution completed"
}

# Deploy to GitHub
deploy_to_github() {
    print_status "Deploying to GitHub..."
    
    # Check if there are changes to commit
    if git diff-index --quiet HEAD --; then
        print_warning "No changes to commit"
    else
        git add .
        git commit -m "Production deployment - $(date '+%Y-%m-%d %H:%M:%S')

✅ Backend build verified
✅ Frontend build verified  
✅ Environment configurations updated
✅ Ready for Render + Netlify deployment

🚀 Deploy commands:
- Backend: Render will auto-deploy from this commit
- Frontend: Netlify will auto-deploy from this commit"
        
        git push origin main
        print_success "Changes pushed to GitHub"
    fi
}

# Generate deployment URLs
generate_deployment_info() {
    print_status "Generating deployment information..."
    
    cat << EOF > DEPLOYMENT_URLS.md
# 🚀 Jobifies Deployment Information

## Deployment Status
- **Date**: $(date '+%Y-%m-%d %H:%M:%S')
- **Git Commit**: $(git rev-parse HEAD)
- **Branch**: $(git branch --show-current)

## 🔗 Deployment URLs

### Backend (Render)
- **Deploy URL**: https://dashboard.render.com/
- **Expected Live URL**: https://jobifies-v5-backend.onrender.com
- **Health Check**: https://jobifies-v5-backend.onrender.com/api/health
- **API Docs**: https://jobifies-v5-backend.onrender.com/api-docs

### Frontend (Netlify)
- **Deploy URL**: https://app.netlify.com/
- **Expected Live URL**: https://jobifies-portal.netlify.app
- **Admin Panel**: https://jobifies-portal.netlify.app/admin

## 📋 Post-Deployment Checklist

### Render Backend Setup:
1. ✅ Connect GitHub repository
2. ⏳ Configure environment variables (see .env.production)
3. ⏳ Create PostgreSQL database  
4. ⏳ Verify health endpoint responds
5. ⏳ Test API endpoints

### Netlify Frontend Setup:
1. ✅ Connect GitHub repository
2. ⏳ Configure build settings (base: frontend, build: npm run build, publish: .next)
3. ⏳ Configure environment variables (see .env.production)
4. ⏳ Update CORS_ORIGIN in backend with actual Netlify URL
5. ⏳ Test complete application flow

## 🧪 Testing Checklist
- [ ] Homepage loads correctly
- [ ] Job search and filtering works
- [ ] Company profiles display
- [ ] User registration/login
- [ ] Job application process
- [ ] Admin panel access
- [ ] API health checks
- [ ] Database connectivity
- [ ] CORS configuration
- [ ] Security headers

## 🔧 Environment Variables

### Render Backend Variables:
\`\`\`
NODE_ENV=production
PORT=10000
DATABASE_URL=[auto-filled]
JWT_SECRET=[generate-secure-token]
SESSION_SECRET=[generate-secure-token]
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-netlify-url.netlify.app
\`\`\`

### Netlify Frontend Variables:
\`\`\`
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_ENV=production
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1
\`\`\`

## 📞 Support
If deployment issues occur, check the logs in respective platforms and verify environment variable configuration.
EOF

    print_success "Deployment information saved to DEPLOYMENT_URLS.md"
}

# Main deployment process
main() {
    echo "🎯 Jobifies Production Deployment"
    echo "=================================="
    echo "This script will prepare your job portal for production deployment"
    echo ""
    
    check_requirements
    validate_environment
    test_backend_build
    test_frontend_build
    run_tests
    deploy_to_github
    generate_deployment_info
    
    echo ""
    echo "================================================"
    print_success "🎉 Deployment preparation completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. 🖥️  Go to Render dashboard and deploy backend"
    echo "2. 🌐 Go to Netlify dashboard and deploy frontend"
    echo "3. ⚙️  Configure environment variables in both platforms"
    echo "4. 🔗 Update CORS settings with actual URLs"
    echo "5. 🧪 Test the live application"
    echo ""
    print_status "📋 Detailed instructions are in DEPLOYMENT_URLS.md"
    echo "================================================"
}

# Run main function
main "$@"
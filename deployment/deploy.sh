#!/bin/bash

################################################################################
# MedFMS - Automated Deployment Script
# This script deploys/updates the MedFMS application on GCP VM
################################################################################

set -e  # Exit on any error

# Configuration
REPO_URL="${REPO_URL:-https://github.com/mieitza/MedFMS.git}"
APP_DIR="${APP_DIR:-/var/www/medfms}"
BRANCH="${BRANCH:-main}"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Load environment variables if .env.production exists
if [ -f "$APP_DIR/deployment/.env.production" ]; then
    log_info "Loading environment variables..."
    # Use a safer method to load env file (grep to remove comments and empty lines)
    set -a
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            # Remove leading/trailing whitespace and quotes from value
            value=$(echo "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
            export "$key=$value"
        fi
    done < <(grep -v '^[[:space:]]*#' "$APP_DIR/deployment/.env.production" | grep -v '^[[:space:]]*$')
    set +a
fi

log_info "=========================================="
log_info "MedFMS Deployment Script"
log_info "=========================================="
log_info "Repository: $REPO_URL"
log_info "Branch: $BRANCH"
log_info "App Directory: $APP_DIR"
log_info "=========================================="

# Check if this is first deployment
FIRST_DEPLOY=false
if [ ! -d "$APP_DIR/.git" ]; then
    FIRST_DEPLOY=true
    log_warn "First deployment detected"
fi

# Backup existing database before deployment
if [ "$FIRST_DEPLOY" = false ] && [ -f "$APP_DIR/app/backend/database.sqlite" ]; then
    log_step "Backing up database..."
    BACKUP_FILE="/var/backups/medfms/database_$(date +%Y%m%d_%H%M%S).sqlite"
    cp "$APP_DIR/app/backend/database.sqlite" "$BACKUP_FILE"
    log_info "Database backed up to: $BACKUP_FILE"
fi

# Clone or update repository
if [ "$FIRST_DEPLOY" = true ]; then
    log_step "Cloning repository..."
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
else
    log_step "Updating repository..."
    cd "$APP_DIR"

    # Stash any local changes
    git stash

    # Fetch latest changes
    git fetch origin

    # Checkout and pull the specified branch
    git checkout "$BRANCH"
    git pull origin "$BRANCH"

    log_info "Repository updated to latest version"
fi

# Load production environment variables
if [ -f "$APP_DIR/deployment/.env.production" ]; then
    log_info "Copying production environment file..."
    cp "$APP_DIR/deployment/.env.production" "$APP_DIR/.env"
else
    log_warn "No .env.production file found in deployment directory"
    if [ ! -f "$APP_DIR/.env" ]; then
        log_error ".env file is required. Please create deployment/.env.production"
        exit 1
    fi
fi

# Install all dependencies from root (handles workspaces)
log_step "Installing dependencies..."
cd "$APP_DIR"
npm ci

# Build frontend (backend will run with tsx, no build needed)
log_step "Building frontend..."
cd "$APP_DIR"
npm run build:frontend

# Verify frontend build
log_step "Verifying frontend build..."
if [ ! -d "$APP_DIR/app/frontend/build" ]; then
    log_error "Frontend build failed - build directory not found"
    exit 1
fi

# Setup database directory
mkdir -p "$APP_DIR/data/db"
if [ ! -f "$APP_DIR/data/db/database.sqlite" ] && [ -f "$APP_DIR/app/backend/database.sqlite" ]; then
    log_info "Moving database to data directory..."
    mv "$APP_DIR/app/backend/database.sqlite" "$APP_DIR/data/db/database.sqlite"
fi

# Update database path in environment
export DATABASE_PATH="$APP_DIR/data/db/database.sqlite"

# Run database migrations
log_step "Running database migrations..."
cd "$APP_DIR/app/backend"
npm run db:push || log_warn "Database migration had warnings (this may be normal)"

# Setup PM2 ecosystem file if not exists
if [ ! -f "$APP_DIR/ecosystem.config.js" ]; then
    log_info "Creating PM2 ecosystem configuration..."
    cp "$APP_DIR/deployment/ecosystem.config.js" "$APP_DIR/ecosystem.config.js"
fi

# Restart/Start application with PM2
log_step "Managing application processes..."
cd "$APP_DIR"

if pm2 describe medfms-backend > /dev/null 2>&1; then
    log_info "Restarting backend..."
    pm2 restart medfms-backend
else
    log_info "Starting backend for the first time..."
    pm2 start ecosystem.config.js --only medfms-backend
fi

if pm2 describe medfms-frontend > /dev/null 2>&1; then
    log_info "Restarting frontend..."
    pm2 restart medfms-frontend
else
    log_info "Starting frontend for the first time..."
    pm2 start ecosystem.config.js --only medfms-frontend
fi

# Save PM2 configuration
pm2 save

# Setup nginx if domain is provided
if [ ! -z "$DOMAIN" ]; then
    log_step "Configuring nginx..."

    # Generate nginx config from template
    sed "s/{{DOMAIN}}/$DOMAIN/g" "$APP_DIR/deployment/nginx.conf" | \
    sed "s|{{APP_DIR}}|$APP_DIR|g" | \
    sudo tee /etc/nginx/sites-available/medfms > /dev/null

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/medfms /etc/nginx/sites-enabled/medfms

    # Test nginx configuration
    sudo nginx -t

    # Reload nginx
    sudo systemctl reload nginx

    log_info "Nginx configured for domain: $DOMAIN"

    # Setup SSL with Let's Encrypt if email is provided
    if [ ! -z "$EMAIL" ]; then
        log_step "Setting up SSL certificate..."
        sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" || \
            log_warn "SSL setup failed or certificate already exists"
    fi
fi

# Health check
log_step "Performing health check..."
sleep 5

# Check if backend is responding
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_info "✓ Backend is healthy"
else
    log_warn "✗ Backend health check failed"
fi

# Check if frontend is responding
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    log_info "✓ Frontend is healthy"
else
    log_warn "✗ Frontend health check failed"
fi

# Display PM2 status
log_step "Application Status:"
pm2 status

# Display logs location
log_info "=========================================="
log_info "Deployment Complete!"
log_info "=========================================="
log_info ""
log_info "Application URLs:"
if [ ! -z "$DOMAIN" ]; then
    log_info "  Production: https://$DOMAIN"
fi
log_info "  Backend:  http://localhost:3000"
log_info "  Frontend: http://localhost:5173"
log_info ""
log_info "Useful commands:"
log_info "  View logs:     pm2 logs"
log_info "  View status:   pm2 status"
log_info "  Restart:       pm2 restart all"
log_info "  Monitor:       pm2 monit"
log_info ""
log_info "Database backup: $BACKUP_FILE"
log_info "=========================================="

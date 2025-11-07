#!/bin/bash

################################################################################
# MedFMS - Database Seeding Script
# This script seeds the production database from a backup file
################################################################################

set -e  # Exit on any error

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

# Configuration
APP_DIR="${APP_DIR:-/var/www/medfms}"
DB_PATH="$APP_DIR/data/db/database.sqlite"
BACKUP_DIR="$APP_DIR/deployment/backups"

log_info "==========================================="
log_info "MedFMS Database Seeding Script"
log_info "==========================================="

# Check if backup file is provided
if [ -z "$1" ]; then
    log_error "Usage: $0 <backup-file>"
    log_info "Example: $0 /path/to/database_backup.sqlite"
    log_info "Or: $0 latest (to use the latest backup from $BACKUP_DIR)"
    exit 1
fi

BACKUP_FILE="$1"

# Handle 'latest' keyword
if [ "$BACKUP_FILE" = "latest" ]; then
    if [ ! -d "$BACKUP_DIR" ]; then
        log_error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi

    # Find the latest backup file
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*.sqlite 2>/dev/null | head -n1)

    if [ -z "$BACKUP_FILE" ]; then
        log_error "No backup files found in $BACKUP_DIR"
        exit 1
    fi

    log_info "Using latest backup: $BACKUP_FILE"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if database already exists
if [ -f "$DB_PATH" ]; then
    log_warn "Database already exists at: $DB_PATH"

    # Create backup of existing database
    EXISTING_BACKUP="/var/backups/medfms/before_seed_$(date +%Y%m%d_%H%M%S).sqlite"
    log_step "Creating backup of existing database..."
    mkdir -p /var/backups/medfms
    cp "$DB_PATH" "$EXISTING_BACKUP"
    log_info "Existing database backed up to: $EXISTING_BACKUP"

    # Ask for confirmation
    read -p "Do you want to replace it? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Seeding cancelled."
        exit 0
    fi
fi

# Create database directory if it doesn't exist
mkdir -p "$(dirname "$DB_PATH")"

# Copy backup file to database location
log_step "Copying backup to database location..."
cp "$BACKUP_FILE" "$DB_PATH"

# Set correct permissions
log_step "Setting permissions..."
chown -R $USER:$USER "$APP_DIR/data/"
chmod 644 "$DB_PATH"

# Verify database integrity
log_step "Verifying database integrity..."
if command -v sqlite3 &> /dev/null; then
    if sqlite3 "$DB_PATH" "PRAGMA integrity_check;" | grep -q "ok"; then
        log_info "✓ Database integrity check passed"
    else
        log_error "✗ Database integrity check failed"
        exit 1
    fi
else
    log_warn "sqlite3 not found, skipping integrity check"
fi

# Restart backend if PM2 is managing it
if command -v pm2 &> /dev/null && pm2 describe medfms-backend > /dev/null 2>&1; then
    log_step "Restarting backend..."
    pm2 restart medfms-backend
    log_info "Backend restarted"
fi

log_info "==========================================="
log_info "Database Seeding Complete!"
log_info "==========================================="
log_info "Database path: $DB_PATH"
log_info "Backup used: $BACKUP_FILE"
if [ -n "$EXISTING_BACKUP" ]; then
    log_info "Previous database backed up to: $EXISTING_BACKUP"
fi
log_info "==========================================="

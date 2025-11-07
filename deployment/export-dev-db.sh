#!/bin/bash

################################################################################
# MedFMS - Export Development Database
# This script exports the development database for deployment
################################################################################

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
DEV_DB_PATH="$PROJECT_ROOT/app/backend/database.sqlite"
BACKUP_DIR="$SCRIPT_DIR/backups"
BACKUP_FILE="$BACKUP_DIR/dev_database_$(date +%Y%m%d_%H%M%S).sqlite"

log_info "==========================================="
log_info "MedFMS Development Database Export"
log_info "==========================================="

# Check if development database exists
if [ ! -f "$DEV_DB_PATH" ]; then
    log_warn "Development database not found at: $DEV_DB_PATH"
    log_info "Make sure you have run the application in development mode first"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Export database
log_step "Exporting development database..."
if command -v sqlite3 &> /dev/null; then
    sqlite3 "$DEV_DB_PATH" ".backup '$BACKUP_FILE'"
else
    # Fallback to simple copy if sqlite3 is not available
    cp "$DEV_DB_PATH" "$BACKUP_FILE"
fi

log_info "✓ Database exported to: $BACKUP_FILE"

# Get database size
DB_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log_info "Database size: $DB_SIZE"

# Count some key tables if sqlite3 is available
if command -v sqlite3 &> /dev/null; then
    log_step "Database statistics:"

    USERS=$(sqlite3 "$BACKUP_FILE" "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "N/A")
    VEHICLES=$(sqlite3 "$BACKUP_FILE" "SELECT COUNT(*) FROM vehicles;" 2>/dev/null || echo "N/A")
    FUEL_TXN=$(sqlite3 "$BACKUP_FILE" "SELECT COUNT(*) FROM fuel_transactions;" 2>/dev/null || echo "N/A")

    log_info "  Users: $USERS"
    log_info "  Vehicles: $VEHICLES"
    log_info "  Fuel Transactions: $FUEL_TXN"
fi

log_info "==========================================="
log_info "Next Steps:"
log_info "==========================================="
log_info "1. Upload to VM:"
log_info "   scp $BACKUP_FILE admin@your-vm-ip:/tmp/"
log_info ""
log_info "2. On the VM, run:"
log_info "   cd /var/www/medfms"
log_info "   ./deployment/seed-db.sh /tmp/$(basename "$BACKUP_FILE")"
log_info "==========================================="

#!/bin/bash

################################################################################
# MedFMS - Create First Admin User
# This script creates the first admin user in the database
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
DB_PATH="${DB_PATH:-$PROJECT_ROOT/data/db/database.sqlite}"

log_info "==========================================="
log_info "MedFMS - Create First Admin User"
log_info "==========================================="

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    log_error "Database not found at: $DB_PATH"
    log_info "Please run the deployment script first to create the database"
    exit 1
fi

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    log_error "sqlite3 is not installed"
    log_info "Install it with: sudo apt-get install sqlite3"
    exit 1
fi

# Check if any users already exist
USER_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
if [ "$USER_COUNT" != "0" ]; then
    log_warn "Database already has $USER_COUNT user(s)"
    read -p "Do you want to create another admin user? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Cancelled."
        exit 0
    fi
fi

# Collect user information
log_step "Please enter the admin user details:"
echo ""

read -p "Username: " USERNAME
if [ -z "$USERNAME" ]; then
    log_error "Username cannot be empty"
    exit 1
fi

read -p "Email: " EMAIL
if [ -z "$EMAIL" ]; then
    log_error "Email cannot be empty"
    exit 1
fi

read -p "Full Name: " FULL_NAME
if [ -z "$FULL_NAME" ]; then
    log_error "Full name cannot be empty"
    exit 1
fi

read -s -p "PIN (4-8 digits): " PIN
echo ""
if [ -z "$PIN" ]; then
    log_error "PIN cannot be empty"
    exit 1
fi

read -s -p "Confirm PIN: " PIN_CONFIRM
echo ""
if [ "$PIN" != "$PIN_CONFIRM" ]; then
    log_error "PINs do not match"
    exit 1
fi

# Check if username already exists
EXISTING=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users WHERE username='$USERNAME';" 2>/dev/null || echo "0")
if [ "$EXISTING" != "0" ]; then
    log_error "Username '$USERNAME' already exists"
    exit 1
fi

# Create Node.js script to hash PIN and insert user
log_step "Creating admin user..."

TEMP_SCRIPT=$(mktemp /tmp/create-admin.XXXXXX.mjs)
cat > "$TEMP_SCRIPT" << 'SCRIPT_END'
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const args = process.argv.slice(2);
const dbPath = args[0];
const username = args[1];
const email = args[2];
const fullName = args[3];
const pin = args[4];

(async () => {
  try {
    // Hash PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Open database
    const db = new Database(dbPath);

    // Insert user
    const result = db.prepare(`
      INSERT INTO users (username, email, full_name, pin, role, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'admin', 1, datetime('now'), datetime('now'))
    `).run(username, email, fullName, hashedPin);

    console.log('SUCCESS:' + result.lastInsertRowid);

    db.close();
  } catch (error) {
    console.error('ERROR:' + error.message);
    process.exit(1);
  }
})();
SCRIPT_END

# Run the Node.js script
cd "$PROJECT_ROOT"
OUTPUT=$(node "$TEMP_SCRIPT" "$DB_PATH" "$USERNAME" "$EMAIL" "$FULL_NAME" "$PIN" 2>&1)
RESULT=$?

# Clean up temp script
rm -f "$TEMP_SCRIPT"

# Check result
if [ $RESULT -eq 0 ] && echo "$OUTPUT" | grep -q "SUCCESS:"; then
    USER_ID=$(echo "$OUTPUT" | grep "SUCCESS:" | cut -d: -f2)
    log_info "==========================================="
    log_info "✓ Admin user created successfully!"
    log_info "==========================================="
    log_info "User ID: $USER_ID"
    log_info "Username: $USERNAME"
    log_info "Email: $EMAIL"
    log_info "Full Name: $FULL_NAME"
    log_info "Role: admin"
    log_info "==========================================="
    log_info ""
    log_info "You can now log in at: http://medfms.cognitcube.com"
    log_info "==========================================="
else
    log_error "Failed to create user"
    echo "$OUTPUT"
    exit 1
fi

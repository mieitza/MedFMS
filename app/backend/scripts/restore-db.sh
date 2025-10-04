#!/bin/bash

# Database restore script for MedFMS
# Usage: ./scripts/restore-db.sh <backup-name>

set -e

# Configuration
DB_PATH="${DATABASE_PATH:-/Users/mihai/dev/GitHub/MedFMS/app/backend/data/medfms.db}"
BACKUP_DIR="/Users/mihai/dev/GitHub/MedFMS/app/backend/data/backups"

# Check if backup name is provided
if [ -z "$1" ]; then
    echo "Error: Backup name is required"
    echo "Usage: $0 <backup-name>"
    echo ""
    echo "Available backups:"
    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR" | grep "\.db$" || echo "No backups found"
    else
        echo "No backup directory found at $BACKUP_DIR"
    fi
    exit 1
fi

BACKUP_NAME="$1"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.db"

# Check if backup exists
if [ ! -f "$BACKUP_PATH" ]; then
    echo "Error: Backup not found at $BACKUP_PATH"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR" | grep "\.db$" || echo "No backups found"
    exit 1
fi

# Display backup info if available
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}.info" ]; then
    echo "Backup Information:"
    cat "${BACKUP_DIR}/${BACKUP_NAME}.info"
    echo ""
fi

# Confirm restoration
read -p "Are you sure you want to restore from backup '${BACKUP_NAME}'? This will OVERWRITE the current database! (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Create a safety backup of current database before restoring
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SAFETY_BACKUP="${BACKUP_DIR}/pre_restore_${TIMESTAMP}.db"

echo "Creating safety backup of current database..."
if [ -f "$DB_PATH" ]; then
    sqlite3 "$DB_PATH" ".backup '$SAFETY_BACKUP'"
    echo "Safety backup created at: $SAFETY_BACKUP"
fi

# Stop any processes using the database (optional, uncomment if needed)
# echo "Checking for processes using the database..."
# lsof "$DB_PATH" 2>/dev/null && echo "Warning: Database is in use. Please stop the application first." && exit 1

# Remove WAL and SHM files
if [ -f "${DB_PATH}-wal" ]; then
    rm "${DB_PATH}-wal"
    echo "Removed WAL file"
fi

if [ -f "${DB_PATH}-shm" ]; then
    rm "${DB_PATH}-shm"
    echo "Removed SHM file"
fi

# Restore the database
echo "Restoring database from backup..."
cp "$BACKUP_PATH" "$DB_PATH"

# Restore WAL and SHM files if they exist in backup
if [ -f "${BACKUP_PATH}-wal" ]; then
    cp "${BACKUP_PATH}-wal" "${DB_PATH}-wal"
    echo "Restored WAL file"
fi

if [ -f "${BACKUP_PATH}-shm" ]; then
    cp "${BACKUP_PATH}-shm" "${DB_PATH}-shm"
    echo "Restored SHM file"
fi

# Verify the restored database
echo "Verifying restored database..."
if sqlite3 "$DB_PATH" "PRAGMA integrity_check;" | grep -q "ok"; then
    echo "Database integrity check: PASSED"
else
    echo "Warning: Database integrity check failed!"
    echo "Safety backup is available at: $SAFETY_BACKUP"
    exit 1
fi

echo ""
echo "Database restored successfully!"
echo "Restored from: $BACKUP_PATH"
echo "Safety backup: $SAFETY_BACKUP"
echo ""
echo "You may need to restart the application for changes to take effect."

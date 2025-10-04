#!/bin/bash

# Database backup script for MedFMS
# Usage: ./scripts/backup-db.sh [backup-name]

set -e

# Configuration
DB_PATH="${DATABASE_PATH:-/Users/mihai/dev/GitHub/MedFMS/app/backend/data/medfms.db}"
BACKUP_DIR="/Users/mihai/dev/GitHub/MedFMS/app/backend/data/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Use custom name if provided, otherwise use timestamp
if [ -n "$1" ]; then
    BACKUP_NAME="$1"
else
    BACKUP_NAME="backup_${TIMESTAMP}"
fi

BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database not found at $DB_PATH"
    exit 1
fi

# Backup using SQLite backup command (handles WAL mode properly)
echo "Creating backup: ${BACKUP_NAME}.db"
sqlite3 "$DB_PATH" ".backup '$BACKUP_PATH'"

# Also backup WAL and SHM files if they exist
if [ -f "${DB_PATH}-wal" ]; then
    cp "${DB_PATH}-wal" "${BACKUP_PATH}-wal"
    echo "Backed up WAL file"
fi

if [ -f "${DB_PATH}-shm" ]; then
    cp "${DB_PATH}-shm" "${BACKUP_PATH}-shm"
    echo "Backed up SHM file"
fi

# Create a metadata file
cat > "${BACKUP_DIR}/${BACKUP_NAME}.info" << EOF
Backup Created: $(date)
Database Path: $DB_PATH
Backup Name: $BACKUP_NAME
Database Size: $(du -h "$DB_PATH" | cut -f1)
EOF

echo "Backup completed successfully!"
echo "Backup location: $BACKUP_PATH"
echo "Backup info: ${BACKUP_DIR}/${BACKUP_NAME}.info"

# List all backups
echo ""
echo "Available backups:"
ls -lh "$BACKUP_DIR" | grep "\.db$"

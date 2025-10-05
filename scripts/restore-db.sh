#!/bin/bash

# Database restore script for MedFMS
# Restores a SQLite database from a backup file

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Database paths
DB_PATH="${PROJECT_ROOT}/app/backend/data/medfms.db"
BACKUP_DIR="${PROJECT_ROOT}/backups"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/medfms_backup_*.db 2>/dev/null | awk '{print "  " $9, "("$5")"}'
    exit 1
fi

BACKUP_FILE="$1"

# If only filename is provided, look in backup directory
if [ ! -f "$BACKUP_FILE" ]; then
    BACKUP_FILE="${BACKUP_DIR}/$1"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/medfms_backup_*.db 2>/dev/null | awk '{print "  " $9, "("$5")"}'
    exit 1
fi

# Create a safety backup of current database before restoring
if [ -f "$DB_PATH" ]; then
    SAFETY_BACKUP="${DB_PATH}.before_restore_$(date +"%Y%m%d_%H%M%S")"
    echo "Creating safety backup of current database..."
    echo "Safety backup: $SAFETY_BACKUP"
    cp "$DB_PATH" "$SAFETY_BACKUP"

    if [ $? -ne 0 ]; then
        echo "Error: Failed to create safety backup"
        exit 1
    fi
fi

# Restore the backup
echo ""
echo "Restoring database from backup..."
echo "Source: $BACKUP_FILE"
echo "Destination: $DB_PATH"
echo ""
read -p "Are you sure you want to restore this backup? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Copy backup to database location
cp "$BACKUP_FILE" "$DB_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "Database restored successfully!"
    echo ""
    echo "Note: If you need to revert, the previous database was backed up to:"
    echo "$SAFETY_BACKUP"
    exit 0
else
    echo "Error: Restore failed"

    # Try to restore from safety backup
    if [ -f "$SAFETY_BACKUP" ]; then
        echo "Attempting to restore from safety backup..."
        cp "$SAFETY_BACKUP" "$DB_PATH"
        echo "Original database restored from safety backup"
    fi

    exit 1
fi

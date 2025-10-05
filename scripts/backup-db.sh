#!/bin/bash

# Database backup script for MedFMS
# Creates a timestamped backup of the SQLite database

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Database paths
DB_PATH="${PROJECT_ROOT}/app/backend/data/medfms.db"
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/medfms_backup_${TIMESTAMP}.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database file not found at $DB_PATH"
    exit 1
fi

# Create backup using SQLite's backup command
echo "Creating backup of MedFMS database..."
echo "Source: $DB_PATH"
echo "Destination: $BACKUP_FILE"

# Use SQLite's .backup command for a consistent backup
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_FILE"

    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup size: $SIZE"

    # Keep only the last 10 backups
    echo "Cleaning up old backups (keeping last 10)..."
    cd "$BACKUP_DIR"
    ls -t medfms_backup_*.db | tail -n +11 | xargs rm -f 2>/dev/null

    # List all current backups
    echo ""
    echo "Current backups:"
    ls -lh medfms_backup_*.db 2>/dev/null | awk '{print $9, "("$5")"}'

    exit 0
else
    echo "Error: Backup failed"
    exit 1
fi

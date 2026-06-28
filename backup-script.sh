#!/bin/sh

# Backup script for PostgreSQL and Elasticsearch
# This script creates backups, compresses them, and maintains only the latest backup

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
POSTGRES_BACKUP_FILE="postgres_backup_${TIMESTAMP}.sql"
ELASTICSEARCH_BACKUP_DIR="elasticsearch_backup_${TIMESTAMP}"
FINAL_BACKUP_ZIP="backup_${TIMESTAMP}.zip"
BACKEND_URL="https://mynds.com.br/v1" # Adjust this to your NestJS backend URL

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR
cd $BACKUP_DIR

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

cleanup_old_backups() {
    log "Cleaning up old backups..."
    # Remove all existing backup files except the current one being created
    find $BACKUP_DIR -name "backup_*.zip" -type f ! -name "$FINAL_BACKUP_ZIP" -delete
    find $BACKUP_DIR -name "postgres_backup_*.sql" -type f -delete
    find $BACKUP_DIR -name "elasticsearch_backup_*" -type d -exec rm -rf {} + 2>/dev/null || true
    log "Old backups cleaned up"
}

backup_postgres() {
    log "Starting PostgreSQL backup..."
    
    # Wait for PostgreSQL to be ready
    until pg_isready -h $POSTGRES_HOST -p 5432 -U $POSTGRES_USER; do
        log "Waiting for PostgreSQL to be ready..."
        sleep 5
    done
    
    # Create PostgreSQL dump
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB > $POSTGRES_BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        log "PostgreSQL backup completed successfully"
    else
        log "PostgreSQL backup failed"
        return 1
    fi
}

backup_elasticsearch() {
    log "Starting Elasticsearch backup..."
    
    # Wait for Elasticsearch to be ready
    until curl -s "http://${ELASTICSEARCH_HOST}:9200/_cluster/health" > /dev/null; do
        log "Waiting for Elasticsearch to be ready..."
        sleep 5
    done
    
    # Create Elasticsearch backup directory
    mkdir -p $ELASTICSEARCH_BACKUP_DIR
    
    # Get all indices
    INDICES=$(curl -s "http://${ELASTICSEARCH_HOST}:9200/_cat/indices?h=index" | grep -v "^\.")
    
    if [ -z "$INDICES" ]; then
        log "No indices found in Elasticsearch"
        # Create empty marker file
        touch "${ELASTICSEARCH_BACKUP_DIR}/no_indices.txt"
    else
        log "Found indices: $INDICES"
        
        # Export each index
        for index in $INDICES; do
            log "Backing up index: $index"
            curl -s -X GET "http://${ELASTICSEARCH_HOST}:9200/${index}/_search?scroll=1m&size=1000" | \
            curl -s -X POST "http://${ELASTICSEARCH_HOST}:9200/_bulk" -H "Content-Type: application/json" --data-binary @- > /dev/null
            
            # Export index mapping and data
            curl -s "http://${ELASTICSEARCH_HOST}:9200/${index}/_mapping" > "${ELASTICSEARCH_BACKUP_DIR}/${index}_mapping.json"
            curl -s "http://${ELASTICSEARCH_HOST}:9200/${index}/_search?size=10000" > "${ELASTICSEARCH_BACKUP_DIR}/${index}_data.json"
        done
    fi
    
    log "Elasticsearch backup completed"
}

create_compressed_backup() {
    log "Creating compressed backup..."
    
    # Create zip file with both backups
    zip -r $FINAL_BACKUP_ZIP $POSTGRES_BACKUP_FILE $ELASTICSEARCH_BACKUP_DIR
    
    if [ $? -eq 0 ]; then
        log "Compressed backup created: $FINAL_BACKUP_ZIP"
        # Remove uncompressed files
        rm -f $POSTGRES_BACKUP_FILE
        rm -rf $ELASTICSEARCH_BACKUP_DIR
    else
        log "Failed to create compressed backup"
        return 1
    fi
}


send_backup_notification() {
    log "Sending backup notification email..."
    
    # Get absolute paths
    BACKUP_DIR=$(realpath "$BACKUP_DIR")
    BACKUP_PATH="$BACKUP_DIR/$FINAL_BACKUP_ZIP"
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    
    # Debug information
    log "Current directory: $(pwd)"
    log "Backup directory: $BACKUP_DIR"
    log "Backup file: $BACKUP_PATH"
    log "File size: $BACKUP_SIZE"
    log "File permissions: $(ls -l "$BACKUP_PATH")"
    
    # Verify backup file exists and is readable
    if [ ! -f "$BACKUP_PATH" ]; then
        log "Error: Backup file not found at $BACKUP_PATH"
        return 1
    fi
    
    if [ ! -r "$BACKUP_PATH" ]; then
        log "Error: Backup file is not readable at $BACKUP_PATH"
        return 1
    fi
    
    # Create HTML content for the email (escape quotes and newlines)
    HTML_CONTENT="<h2>Backup Completed Successfully</h2><p>Backup details:</p><ul><li>Backup file: $FINAL_BACKUP_ZIP</li><li>Backup size: $BACKUP_SIZE</li><li>Timestamp: $TIMESTAMP</li></ul><p>The backup file is attached to this email.</p>"
    
    # Escape HTML content for JSON
    HTML_ESCAPED=$(echo "$HTML_CONTENT" | sed 's/"/\\"/g')
    
    # Create JSON data using printf for better control
    JSON_DATA=$(printf '{"to":"juliovianadev@gmail.com","subject":"Backup Completed - %s","html":"%s"}' "$TIMESTAMP" "$HTML_ESCAPED")
    
    log "JSON Data: $JSON_DATA"
    
    log "Attempting to send backup file..."
    RESPONSE=$(curl -w "\n%{http_code}" -X POST "$BACKEND_URL/mail/send" \
        -H "Content-Type: multipart/form-data" \
        -F "data=$JSON_DATA" \
        -F "file=@$BACKUP_PATH")
    
    # Extract HTTP status code
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
    
    log "HTTP Status: $HTTP_CODE"
    log "Response: $RESPONSE_BODY"
    
    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
        log "Backup notification email sent successfully with attachment"
        return 0
    else
        log "Failed to send backup notification email. HTTP Status: $HTTP_CODE"
        log "Response: $RESPONSE_BODY"
        return 1
    fi
}

main() {
    log "=== Starting backup process ==="
    
    # Clean up old backups first
    cleanup_old_backups
    
    # Perform backups
    if backup_postgres && backup_elasticsearch; then
        create_compressed_backup
        log "=== Backup process completed successfully ==="
        log "Backup file: $BACKUP_DIR/$FINAL_BACKUP_ZIP"
        log "Backup size: $(du -h $BACKUP_DIR/$FINAL_BACKUP_ZIP | cut -f1)"
        
        # Send email notification
        send_backup_notification
    else
        log "=== Backup process failed ==="
        # Clean up partial files on failure
        rm -f $POSTGRES_BACKUP_FILE
        rm -rf $ELASTICSEARCH_BACKUP_DIR
        exit 1
    fi
}

# Add cron job for hourly backups
echo "0 * * * * /backup-script.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

# Run main function if script is executed directly
if [ "${1}" != "cron-setup" ]; then
    main
fi
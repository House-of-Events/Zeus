#!/bin/bash

# Change to a writable directory
EXPORT_DIR="/tmp"

# Export schema and data from Docker PostgreSQL
echo "Exporting schema and data from Docker PostgreSQL..."
pg_dump -U admin -d zeus-docker > $EXPORT_DIR/docker_dump.sql

# Import schema and data into local PostgreSQL
echo "Importing schema and data into local PostgreSQL..."
psql -U admin -d zeus-docker -f $EXPORT_DIR/docker_dump.sql

# Export data-only from Docker PostgreSQL
echo "Exporting data only from Docker PostgreSQL..."
pg_dump -U admin -d zeus-docker --data-only > $EXPORT_DIR/data_dump.sql

# Seed data into local PostgreSQL
echo "Seeding data into local PostgreSQL..."
psql -U admin -d zeus-docker -f $EXPORT_DIR/data_dump.sql

echo "Database synchronization complete."

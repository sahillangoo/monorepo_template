-- Database initialization script for e-commerce application
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional databases if needed
-- CREATE DATABASE ecommerce_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ecommerce_dev TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_prod TO ecommerce_user;

-- Set timezone
SET timezone = 'UTC';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'User: %', current_user;
    RAISE NOTICE 'Timezone: %', current_setting('TIMEZONE');
END $$;

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create database schema
CREATE SCHEMA IF NOT EXISTS power_system;

-- Set search path
SET search_path TO power_system, public;

-- Note: Tables will be created by TypeORM migrations
-- This file just initializes TimescaleDB extension

SELECT 'TimescaleDB initialized successfully' AS status;

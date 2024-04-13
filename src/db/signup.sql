-- Creating database auth_server
CREATE DATABASE auth_server;

-- Create table with column names, data types and constraints
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(100),
    username VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    provider_id BIGINT,
    token TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
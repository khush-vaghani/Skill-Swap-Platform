-- Run this in phpMyAdmin or MySQL CLI
CREATE DATABASE skill_swap_db;

USE skill_swap_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a test user (password: test123)
INSERT INTO users (username, password)
VALUES ('testuser', '$2y$10$9GqtQU2W1u3Bz4Etas1GcuVfB/8.CW1zVJzH6gs/qN81wPjTkYQaG');

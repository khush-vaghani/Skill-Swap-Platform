
CREATE DATABASE IF NOT EXISTS skill_swap_platform;
USE skill_swap_platform;

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    profile_photo_url VARCHAR(255),
    bio TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_location (location),
    INDEX idx_is_public (is_public),
    INDEX idx_is_active (is_active)
);

-- Skills table (master list of available skills)
CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    description TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skill_name (skill_name),
    INDEX idx_category (category),
    INDEX idx_is_approved (is_approved)
);

-- User skills offered (skills that users can teach/share)
CREATE TABLE user_skills_offered (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    description TEXT,
    hourly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_id),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_id (skill_id),
    INDEX idx_is_available (is_available)
);

-- User skills wanted (skills that users want to learn)
CREATE TABLE user_skills_wanted (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Beginner',
    description TEXT,
    max_hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill_wanted (user_id, skill_id),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_id (skill_id),
    INDEX idx_is_active (is_active)
);

-- User availability schedule
CREATE TABLE user_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_is_available (is_available)
);

-- Swap requests table
CREATE TABLE swap_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    requester_id INT NOT NULL,
    provider_id INT NOT NULL,
    requested_skill_id INT NOT NULL,
    offered_skill_id INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed') DEFAULT 'Pending',
    request_message TEXT,
    response_message TEXT,
    proposed_date DATE,
    proposed_time TIME,
    duration_hours DECIMAL(4,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (requested_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    FOREIGN KEY (offered_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_requester_id (requester_id),
    INDEX idx_provider_id (provider_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Ratings and feedback table
CREATE TABLE ratings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    swap_request_id INT NOT NULL,
    rater_id INT NOT NULL,
    rated_user_id INT NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (swap_request_id) REFERENCES swap_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (rater_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rated_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_swap_rating (swap_request_id, rater_id, rated_user_id),
    INDEX idx_swap_request_id (swap_request_id),
    INDEX idx_rater_id (rater_id),
    INDEX idx_rated_user_id (rated_user_id),
    INDEX idx_rating (rating)
);

-- Admin users table
CREATE TABLE admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role ENUM('Super Admin', 'Moderator', 'Support') DEFAULT 'Moderator',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_admin_user (user_id),
    INDEX idx_role (role)
);

-- Platform messages table (for admin announcements)
CREATE TABLE platform_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message_content TEXT NOT NULL,
    message_type ENUM('Announcement', 'Alert', 'Update', 'Maintenance') DEFAULT 'Announcement',
    is_active BOOLEAN DEFAULT TRUE,
    target_audience ENUM('All Users', 'Active Users', 'Premium Users') DEFAULT 'All Users',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id) ON DELETE CASCADE,
    INDEX idx_message_type (message_type),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- User message read status
CREATE TABLE user_message_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES platform_messages(message_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_message (user_id, message_id),
    INDEX idx_user_id (user_id),
    INDEX idx_message_id (message_id)
);

-- Admin actions log
CREATE TABLE admin_actions (
    action_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action_type ENUM('Ban User', 'Unban User', 'Reject Skill', 'Approve Skill', 'Send Message', 'Delete Request') NOT NULL,
    target_user_id INT,
    target_skill_id INT,
    target_request_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (target_skill_id) REFERENCES skills(skill_id) ON DELETE SET NULL,
    FOREIGN KEY (target_request_id) REFERENCES swap_requests(request_id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- User activity log
CREATE TABLE user_activity_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('Login', 'Profile Update', 'Skill Added', 'Skill Removed', 'Request Sent', 'Request Accepted', 'Request Rejected', 'Rating Given') NOT NULL,

    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- Insert sample data for testing

-- Sample skills
INSERT INTO skills (skill_name, category, description) VALUES
('Photoshop', 'Design', 'Adobe Photoshop for image editing and graphic design'),
('Excel', 'Business', 'Microsoft Excel for data analysis and spreadsheet management'),
('Python Programming', 'Technology', 'Python programming language for software development'),
('Cooking', 'Lifestyle', 'Culinary skills and recipe preparation'),
('Guitar', 'Music', 'Acoustic and electric guitar playing'),
('Spanish', 'Language', 'Spanish language speaking and writing'),
('Photography', 'Arts', 'Digital and film photography techniques'),
('Yoga', 'Fitness', 'Yoga poses and meditation practices'),
('Web Development', 'Technology', 'HTML, CSS, and JavaScript for web development'),
('Public Speaking', 'Communication', 'Presentation and public speaking skills');

-- Sample admin user (password should be hashed in production)
INSERT INTO users (username, email, password_hash, first_name, last_name, location, is_public) VALUES
('admin', 'admin@skillswap.com', 'hashed_password_here', 'Admin', 'User', 'Global', TRUE);

-- Insert admin role
INSERT INTO admin_users (user_id, role) VALUES (1, 'Super Admin');

-- Create views for common queries

-- View for user profiles with skill counts
CREATE VIEW user_profiles AS
SELECT 
    u.user_id,
    u.username,
    u.first_name,
    u.last_name,
    u.location,
    u.profile_photo_url,
    u.bio,
    u.is_public,
    u.created_at,
    COUNT(DISTINCT uso.skill_id) as skills_offered_count,
    COUNT(DISTINCT usw.skill_id) as skills_wanted_count
FROM users u
LEFT JOIN user_skills_offered uso ON u.user_id = uso.user_id AND uso.is_available = TRUE
LEFT JOIN user_skills_wanted usw ON u.user_id = usw.user_id AND usw.is_active = TRUE
WHERE u.is_active = TRUE AND u.is_banned = FALSE
GROUP BY u.user_id;

-- View for swap request details
CREATE VIEW swap_request_details AS
SELECT 
    sr.request_id,
    sr.requester_id,
    req.username as requester_username,
    req.first_name as requester_first_name,
    sr.provider_id,
    prov.username as provider_username,
    prov.first_name as provider_first_name,
    req_skill.skill_name as requested_skill,
    off_skill.skill_name as offered_skill,
    sr.status,
    sr.request_message,
    sr.proposed_date,
    sr.proposed_time,
    sr.duration_hours,
    sr.created_at
FROM swap_requests sr
JOIN users req ON sr.requester_id = req.user_id
JOIN users prov ON sr.provider_id = prov.user_id
JOIN skills req_skill ON sr.requested_skill_id = req_skill.skill_id
JOIN skills off_skill ON sr.offered_skill_id = off_skill.skill_id;

-- View for user ratings summary
CREATE VIEW user_ratings_summary AS
SELECT 
    u.user_id,
    u.username,
    u.first_name,
    u.last_name,
    COUNT(r.rating_id) as total_ratings,
    AVG(r.rating) as average_rating,
    MIN(r.rating) as lowest_rating,
    MAX(r.rating) as highest_rating
FROM users u
LEFT JOIN ratings r ON u.user_id = r.rated_user_id
WHERE u.is_active = TRUE
GROUP BY u.user_id;

-- Create stored procedures for common operations

-- Procedure to create a new swap request
DELIMITER //
CREATE PROCEDURE CreateSwapRequest(
    IN p_requester_id INT,
    IN p_provider_id INT,
    IN p_requested_skill_id INT,
    IN p_offered_skill_id INT,
    IN p_request_message TEXT,
    IN p_proposed_date DATE,
    IN p_proposed_time TIME,
    IN p_duration_hours DECIMAL(4,2)
)
BEGIN
    INSERT INTO swap_requests (
        requester_id, provider_id, requested_skill_id, offered_skill_id,
        request_message, proposed_date, proposed_time, duration_hours
    ) VALUES (
        p_requester_id, p_provider_id, p_requested_skill_id, p_offered_skill_id,
        p_request_message, p_proposed_date, p_proposed_time, p_duration_hours
    );
    
    -- Log the activity
    INSERT INTO user_activity_log (user_id, activity_type, activity_details)
    VALUES (p_requester_id, 'Request Sent', JSON_OBJECT('request_id', LAST_INSERT_ID()));
END //
DELIMITER ;

-- Procedure to accept/reject a swap request
DELIMITER //
CREATE PROCEDURE UpdateSwapRequestStatus(
    IN p_request_id INT,
    IN p_status ENUM('Accepted', 'Rejected', 'Cancelled'),
    IN p_response_message TEXT
)
BEGIN
    UPDATE swap_requests 
    SET status = p_status, 
        response_message = p_response_message,
        updated_at = CURRENT_TIMESTAMP
    WHERE request_id = p_request_id;
    
    -- Log the activity
    INSERT INTO user_activity_log (user_id, activity_type, activity_details)
    SELECT 
        CASE 
            WHEN p_status = 'Accepted' THEN provider_id
            ELSE requester_id
        END,
        CASE 
            WHEN p_status = 'Accepted' THEN 'Request Accepted'
            WHEN p_status = 'Rejected' THEN 'Request Rejected'
            ELSE 'Request Cancelled'
        END,
        JSON_OBJECT('request_id', p_request_id, 'status', p_status)
    FROM swap_requests 
    WHERE request_id = p_request_id;
END //
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_swap_requests_status_created ON swap_requests(status, created_at);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);
CREATE INDEX idx_user_activity_log_user_created ON user_activity_log(user_id, created_at);
CREATE INDEX idx_platform_messages_active_expires ON platform_messages(is_active, expires_at);

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON skill_swap_platform.* TO 'app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE skill_swap_platform.* TO 'app_user'@'localhost';

-- Show table creation summary
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'skill_swap_platform'
ORDER BY TABLE_NAME;

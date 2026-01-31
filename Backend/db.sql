-- Create database
CREATE DATABASE IF NOT EXISTS car_service_station_database;
USE car_service_station_database;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('client', 'admin', 'superadmin') DEFAULT 'client',
    isActive BOOLEAN DEFAULT TRUE,
    refreshToken TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    operatingHours VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    basePrice DECIMAL(10,2) NOT NULL,
    estimatedDuration INT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Station service prices table
CREATE TABLE IF NOT EXISTS station_service_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stationId INT NOT NULL,
    serviceId INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stationId) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_station_service (stationId, serviceId)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    serviceId INT NOT NULL,
    stationId INT NOT NULL,
    scheduledDate DATETIME NOT NULL,
    vehicleDetails JSON NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    specialInstructions TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (stationId) REFERENCES stations(id) ON DELETE CASCADE
);

-- Booking status history table
CREATE TABLE IF NOT EXISTS booking_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL,
    notes TEXT,
    changedBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (changedBy) REFERENCES users(id) ON DELETE CASCADE
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT NOT NULL,
    receiptNumber VARCHAR(100) UNIQUE NOT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    issuedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT NOT NULL,
    userId INT NOT NULL,
    message TEXT NOT NULL,
    attachmentUrl VARCHAR(500),
    messageType ENUM('text', 'image', 'file') DEFAULT 'text',
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed data
INSERT IGNORE INTO users (email, password, firstName, lastName, phone, role) VALUES
('client@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Client', '+1234567890', 'client'),
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '+1234567891', 'admin'),
('superadmin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super', 'Admin', '+1234567892', 'superadmin');

INSERT IGNORE INTO stations (name, address, phone, email, operatingHours) VALUES
('Downtown Service Center', '123 Main St, Downtown', '+1-555-0101', 'downtown@carservice.com', 'Mon-Fri 8:00-18:00, Sat 9:00-14:00'),
('Uptown Auto Care', '456 Oak Ave, Uptown', '+1-555-0102', 'uptown@carservice.com', 'Mon-Sat 7:30-17:30');

INSERT IGNORE INTO services (name, description, basePrice, estimatedDuration) VALUES
('Oil Change', 'Complete oil and filter change with premium synthetic oil', 49.99, 30),
('Brake Service', 'Brake pad replacement and brake system inspection', 129.99, 60),
('Tire Rotation', 'Tire rotation and pressure check', 24.99, 20),
('Engine Diagnostic', 'Complete engine computer diagnostic scan', 39.99, 45),
('AC Service', 'AC system recharge and performance check', 89.99, 40);

INSERT IGNORE INTO station_service_prices (stationId, serviceId, price) VALUES
(1, 1, 49.99), (1, 2, 129.99), (1, 3, 24.99), (1, 4, 39.99), (1, 5, 89.99),
	(2, 1, 54.99), (2, 2, 134.99), (2, 3, 29.99), (2, 4, 44.99), (2, 5, 94.99);
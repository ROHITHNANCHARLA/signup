CREATE DATABASE IF NOT EXISTS college_auth;

USE college_auth;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  studentId VARCHAR(50),
  collegeName VARCHAR(100),
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  phone VARCHAR(15),
  department VARCHAR(50),
  degree VARCHAR(50)
);

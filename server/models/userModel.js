const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const TABLE_NAME = 'users';

// Create user table SQL for reference (run in MySQL Workbench separately):
/*
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  college_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  dob DATE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

async function findByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE email = ?`, [email]);
  return rows[0];
}

async function createUser(userData) {
  const {
    college_name,
    student_id,
    first_name,
    last_name,
    email,
    phone,
    dob,
    password,
  } = userData;

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO ${TABLE_NAME} 
    (college_name, student_id, first_name, last_name, email, phone, dob, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [college_name, student_id, first_name, last_name, email, phone, dob, hashedPassword]
  );

  return result.insertId;
}

async function updatePhone(email, newPhone) {
  const [result] = await pool.query(
    `UPDATE ${TABLE_NAME} SET phone = ? WHERE email = ?`,
    [newPhone, email]
  );
  return result.affectedRows;
}

async function updatePassword(email, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const [result] = await pool.query(
    `UPDATE ${TABLE_NAME} SET password = ? WHERE email = ?`,
    [hashedPassword, email]
  );
  return result.affectedRows;
}

module.exports = {
  findByEmail,
  createUser,
  updatePhone,
  updatePassword,
};

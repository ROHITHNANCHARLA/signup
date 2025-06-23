const pool = require('../config/db');

const TABLE_NAME = 'otps';

/*
CREATE TABLE otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL,   -- e.g., 'signup' or 'reset'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
*/

async function saveOTP(email, otpCode, purpose, expiresAt) {
  const [result] = await pool.query(
    `INSERT INTO ${TABLE_NAME} (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)`,
    [email, otpCode, purpose, expiresAt]
  );
  return result.insertId;
}

async function getValidOTP(email, otpCode, purpose) {
  const now = new Date();
  const [rows] = await pool.query(
    `SELECT * FROM ${TABLE_NAME} WHERE email = ? AND otp_code = ? AND purpose = ? AND expires_at > ? ORDER BY created_at DESC LIMIT 1`,
    [email, otpCode, purpose, now]
  );
  return rows[0];
}

async function deleteOTP(id) {
  const [result] = await pool.query(
    `DELETE FROM ${TABLE_NAME} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  saveOTP,
  getValidOTP,
  deleteOTP,
};

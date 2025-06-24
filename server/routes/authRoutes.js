const express = require("express");
const router = express.Router();
const db = require("../db");

// Temporary OTP store
const otps = {};

// --- Signup ---
router.post("/signup", (req, res) => {
  const {
    email,
    collegeName,
    studentId,
    firstName,
    lastName,
    phone,
    department,
    degree,
    password,
  } = req.body;

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, result) => {
    if (result.length > 0) {
      return res.status(400).send("User already exists");
    }

    const insertSql = `INSERT INTO users 
      (email, collegeName, studentId, firstName, lastName, phone, department, degree, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      insertSql,
      [email, collegeName, studentId, firstName, lastName, phone, department, degree, password],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Signup failed");
        }
        res.send("Signup successful");
      }
    );
  });
});

// --- Login ---
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (results.length > 0) {
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
});

// --- Check Email for Siddharatha College ---
router.post("/check-email", (req, res) => {
  const { email } = req.body;
  const domain = email.split("@")[1];

  if (domain === "siddharatha.co.in") {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      if (results.length > 0) {
        const user = results[0];
        return res.json({
          collegeName: user.collegeName,
          studentId: user.studentId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          department: user.department,
          degree: user.degree
        });
      } else {
        return res.status(404).send("User not found");
      }
    });
  } else {
    res.status(400).send("Not a Siddharatha College email");
  }
});

// --- Send OTP ---
router.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;
  console.log(`OTP for ${email}: ${otp}`);
  res.send("OTP sent to registered email (mocked)");
});

// --- Verify OTP ---
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === otp) {
    res.send("OTP verified");
  } else {
    res.status(401).send("Invalid OTP");
  }
});

// --- Reset Password ---
router.post("/reset-password", (req, res) => {
  const { email, password } = req.body;
  const sql = "UPDATE users SET password = ? WHERE email = ?";

  db.query(sql, [password, email], (err) => {
    if (err) return res.status(500).send("Password reset failed");
    res.send("Password reset successful");
  });
});

module.exports = router;

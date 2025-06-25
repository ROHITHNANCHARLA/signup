import db from "../config/db";

const express = require("express");
const router = express.Router();
const sendOTP = require("../utils/emailService");

// Temporary OTP store
const otps = {};

// --- Signup ---
router.post("/signup", (req: { body: { email: any; collegeName: any; studentId: any; firstName: any; lastName: any; phone: any; department: any; degree: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; send: (arg0: string) => void; }) => {
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
  db.query(checkSql, [email], (_err: any, result: string | any[]) => {
    if (result.length > 0) {
      return res.status(400).send("User already exists");
    }

    const insertSql = `INSERT INTO users 
      (email, collegeName, studentId, firstName, lastName, phone, department, degree, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      insertSql,
      [email, collegeName, studentId, firstName, lastName, phone, department, degree, password],
      (err: any) => {
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
router.post("/login", (req: { body: { email: any; password: any; }; }, res: { send: (arg0: string) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (_err: any, results: string | any[]) => {
    if (results.length > 0) {
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
});

// --- Check Email for Siddharatha College ---
router.post("/check-email", (req: { body: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; json: (arg0: { collegeName: any; studentId: any; firstName: any; lastName: any; phone: any; department: any; degree: any; }) => any; }) => {
  const { email } = req.body;
  const domain = email.split("@")[1];

  if (domain === "siddharatha.co.in") {
    const sql = "SELECT * FROM students WHERE email = ?";
    db.query(sql, [email], (err: any, results: string | any[]) => {
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

router.post("/check-registered-email", (req: { body: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; json: (arg0: { val: boolean; }) => any; }) => {
  const { email } = req.body;
  
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err: any, results: string | any[]) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length > 0) {
      return res.json({ val: true });
    } else {
      return res.json({ val: false });
    }
  });
});


// Send OTP & store in DB
router.post("/send-otp", async (req: { body: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; json: (arg0: { msg: any; }) => any; }) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const sql = "INSERT INTO password_reset_otps (email, otp) VALUES (?, ?)";
  db.query(sql, [email, otp], async (err: any) => {
    if (err) return res.status(500).send("Database error");
    try {
      const msg = await sendOTP(email, otp);
      return await res.json({ msg });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).send("Failed to send OTP----" + err);
    }
  });
});

// Verify OTP
router.post("/verify-otp", (req: { body: { email: any; otp: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; send: (arg0: string) => void; }) => {
  const { email, otp } = req.body;

  const sql = `SELECT * FROM password_reset_otps 
               WHERE email = ? AND otp = ? AND used = FALSE 
               AND created_at >= NOW() - INTERVAL 10 MINUTE`;

  db.query(sql, [email, otp], (err: any, results: string | any[]) => {
    if (err) return res.status(500).send("DB error");
    if (results.length === 0) return res.status(401).send("Invalid or expired OTP");

    const updateSql = `UPDATE password_reset_otps SET used = TRUE WHERE id = ?`;
    db.query(updateSql, [results[0].id], () => {
      res.send("OTP verified");
    });
  });
});

// Reset Password
router.post("/reset-password", (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; send: (arg0: string) => void; }) => {
  const { email, password } = req.body;
  const sql = "UPDATE users SET password = ? WHERE email = ?";

  db.query(sql, [password, email], (err: any) => {
    if (err) return res.status(500).send("Password update failed");
    res.send("Password reset successful");
  });
});


module.exports = router;

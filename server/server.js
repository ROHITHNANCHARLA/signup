const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

app.post("/api/signup", (req, res) => {
  const { email, password, studentId, collegeName, firstName, lastName, phone, department, degree } = req.body;
  const query = "INSERT INTO users (email, password, studentId, collegeName, firstName, lastName, phone, department, degree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [email, password, studentId, collegeName, firstName, lastName, phone, department, degree], (err, result) => {
    if (err) return res.status(500).send("Signup failed");
    res.send("Signup successful");
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err || results.length === 0) return res.status(401).send("Invalid credentials");
    res.send("Login successful");
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

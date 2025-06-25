const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "009988", // ⬅️ replace with your actual password
  database: "college_auth"
});

db.connect((err: any) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected!");
  }
});

export default db;

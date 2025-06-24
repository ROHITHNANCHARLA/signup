# College Authentication Backend

This is the backend server for the college authentication web app.  
It provides REST APIs for signup, login, password reset with OTP verification, and email validation.

---

## Features

- Signup with validation for college emails (@sidharthcollege.edu)
- Fetch student data from college master table for verification
- Password hashing with bcrypt
- Email OTP verification for signup and password reset
- Login with email and password
- Password reset using OTP sent via email

---

## Technologies Used

- Node.js with Express.js
- MySQL (mysql2 driver)
- Nodemailer for sending emails
- bcryptjs for password hashing
- dotenv for environment variables
- cors for Cross-Origin Resource Sharing

---

## Project Structure

college-auth-backend/
├── config/
│ └── db.js # MySQL database connection
├── controllers/
│ └── authController.js # Logic for auth APIs
├── routes/
│ └── authRoutes.js # Auth API routes
├── utils/
│ ├── generateOTP.js # OTP generator helper
│ └── sendEmail.js # Email sending utility
├── .env # Environment variables
├── package.json # Project metadata and dependencies
└── server.js # Express app entry point


---

## Setup Instructions

1. Clone or download this repository.

2. Install dependencies:

```bash
npm install

3.  Create a .env file in the root folder with the following variables:

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=college_portal

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

Setup your MySQL database and tables (you will need to create the database and user tables — see the SQL script provided separately).

Start the server:

bash
Copy
Edit
npm run dev
or

bash
Copy
Edit
npm start
The server will run on http://localhost:5000.

API Endpoints
Method	Endpoint	Description
POST	/api/auth/check-email	Check if email is registered and fetch student info if college email
POST	/api/auth/signup	Register a new user
POST	/api/auth/verify-otp	Verify OTP sent to email
POST	/api/auth/login	User login
POST	/api/auth/request-reset	Request OTP for password reset
POST	/api/auth/reset-password	Reset password with OTP

Notes
For Gmail email sending, use an App Password if you have 2FA enabled.

Passwords are stored hashed for security.

OTP codes are 6-digit numeric and expire after use.





# TO SETUP DATABASE..

## ✅ Step-by-Step MySQL Setup on Windows

---

### **1. Install MySQL Server & MySQL Workbench**

* If not already installed:

  * Download from: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
  * Choose **MySQL Installer for Windows (Community)**.
  * During installation:

    * Install both **MySQL Server** and **MySQL Workbench**.
    * Set a root password you’ll remember (e.g., `root123`).

---

### **2. Start MySQL Server**

* Open **MySQL Workbench**.
* Connect using:

  * **Hostname:** `localhost`
  * **Port:** `3306`
  * **Username:** `root`
  * **Password:** (the one you set)

---

### **3. Create Database & Table**

#### Option A: Use MySQL Workbench (GUI)

1. Open **Workbench** and connect.
2. Click on **"Create a new schema"**, name it `college_auth`, and click **Apply**.
3. Select the database and run this query (Ctrl + Enter):

```sql
USE college_auth;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  collegeName VARCHAR(255),
  studentId VARCHAR(100),
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  degree VARCHAR(100),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### Option B: Using Command Line

1. Open **Command Prompt**.
2. Login to MySQL:

```bash
mysql -u root -p
```

3. Then paste:

```sql
CREATE DATABASE college_auth;
USE college_auth;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  collegeName VARCHAR(255),
  studentId VARCHAR(100),
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  degree VARCHAR(100),
  password VARCHAR(255)
);
```

---

### **4. Update Backend Connection**

In `backend/db.js`, match the DB credentials:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password", // <-- change this
  database: "college_auth",
});
```

---

### ✅ Sample Test User (Optional)

Run this SQL in Workbench to insert a test user:

```sql
INSERT INTO users (
  email, collegeName, studentId, firstName, lastName, phone,
  department, degree, password
) VALUES (
  'test@siddharatha.co.in', 'Siddharatha College', 'SID12345',
  'Test', 'User', '9999999999', 'Engineering', 'B.Tech', 'Test@1234'
);
```

---

Once this is done, your MySQL setup is ready.
Next, I’ll help verify your backend is connected properly.

Want me to regenerate the `.env` file and server start steps too?

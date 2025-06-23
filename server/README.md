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
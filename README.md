# College Auth App

This is a full-stack authentication module for a college exam platform.

## Features
- Signup/Login with validations
- Password strength check
- Reset password with OTP

## Technologies
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

## Setup Instructions

1. **Install dependencies**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

2. **Configure MySQL**
   - Create a database `college_auth` using the script in `server/database/schema.sql`
   - Update credentials in `server/config/db.js`

3. **Run the app**
   ```bash
   cd server
   npm run dev
   cd ../client
   npm run dev
   ```

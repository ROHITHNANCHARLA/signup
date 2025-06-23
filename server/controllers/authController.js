const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// Helper to validate email format and college domain
function isCollegeEmail(email) {
  return email.endsWith('@sidharthcollege.edu');
}

// Password validation regex: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
function isValidPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return re.test(password);
}

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await userModel.findByEmail(email);

    if (isCollegeEmail(email)) {
      // If college email, check if user exists and fetch limited info
      if (user) {
        return res.json({
          registered: true,
          editableFields: ['phone'],
          user: {
            college_name: user.college_name,
            student_id: user.student_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
          },
        });
      } else {
        // If college email but not registered, allow full registration
        return res.json({ registered: false, editableFields: 'all' });
      }
    } else {
      // Non-college email
      if (user) {
        return res.json({ registered: true });
      } else {
        return res.json({ registered: false, editableFields: 'all' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      college_name,
      student_id,
      first_name,
      last_name,
      email,
      phone,
      dob,
      password,
      confirm_password,
    } = req.body;

    // Validate mandatory fields
    if (!college_name || !student_id || !first_name || !last_name || !email || !dob || !password || !confirm_password) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be minimum 8 characters, include uppercase, lowercase, number, and special character' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // For college email, you can add logic to verify student_id with college database here

    // Create user (password will be hashed in model)
    const userId = await userModel.createUser({
      college_name,
      student_id,
      first_name,
      last_name,
      email,
      phone,
      dob,
      password,
    });

    // Generate OTP and send email for verification
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await otpModel.saveOTP(email, otpCode, 'signup', expiresAt);

    await sendEmail(email, 'Your Signup OTP', `Your OTP code is ${otpCode}. It expires in 10 minutes.`);

    res.status(201).json({ message: 'User registered successfully. OTP sent to email for verification.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    if (!email || !otp || !purpose) {
      return res.status(400).json({ message: 'Email, OTP and purpose are required' });
    }

    const record = await otpModel.getValidOTP(email, otp, purpose);
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid, delete it
    await otpModel.deleteOTP(record.id);

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // You can generate JWT here if needed

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await otpModel.saveOTP(email, otpCode, 'reset', expiresAt);
    await sendEmail(email, 'Your Password Reset OTP', `Your OTP code is ${otpCode}. It expires in 10 minutes.`);

    res.json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password, confirm_password } = req.body;

    if (!email || !otp || !new_password || !confirm_password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!isValidPassword(new_password)) {
      return res.status(400).json({ message: 'Password must be minimum 8 characters, include uppercase, lowercase, number, and special character' });
    }

    const record = await otpModel.getValidOTP(email, otp, 'reset');
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    await userModel.updatePassword(email, new_password);

    // Delete OTP after use
    await otpModel.deleteOTP(record.id);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

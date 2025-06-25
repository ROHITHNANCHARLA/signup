const nodemailer = require("nodemailer");

async function sendOTP(email: string, otp: number) {
  try {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: '"Siddharatha College" <noreply@siddharatha.co.in>',
      to: email,
      subject: "Your OTP to reset the password",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b>`,
    });

    const previewURL = nodemailer.getTestMessageUrl(info);
    console.log("✅ Email preview URL:", previewURL);
    return previewURL; // Send this to frontend for testing if needed
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw err;
  }
}

module.exports = sendOTP;

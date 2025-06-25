import React, { useState } from "react";
import "../styles/AuthPage.css";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const sendOTP = async () => {
    try {
      const checkRegisteredUser = await fetch("http://localhost:5000/api/check-registered-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (checkRegisteredUser) {
        const res = await fetch("http://localhost:5000/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (!res.ok) throw new Error();
        setInfo("OTP sent to your email.");
        setError("");
        setStep(2);
      } else {
        setError("Failed to send OTP. Ensure the email is registered.");
        setInfo("");
      }
    } catch {
      setError("Failed to send OTP. Ensure the email is registered.");
      setInfo("");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      if (!res.ok) throw new Error();
      setInfo("OTP verified. Set your new password.");
      setError("");
      setStep(3);
    } catch {
      setError("Invalid or expired OTP.");
      setInfo("");
    }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error();
      setInfo("Password reset successful. You can now login.");
      setError("");
      setStep(4);
    } catch {
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={sendOTP}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              required
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}

        {step === 4 && (
          <p className="info">✅ Password reset complete. You may now login.</p>
        )}

        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}
      </form>
    </div>
  );
}

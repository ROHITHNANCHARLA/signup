import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    collegeName: "",
    studentId: "",
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    degree: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const isSiddharathaStudent = form.email.endsWith("@siddharatha.co.in");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value.endsWith("@siddharatha.co.in")) {
      try {
        const res = await fetch("http://localhost:5000/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.collegeName) {
            setForm((prev) => ({
              ...prev,
              ...data,
              email: value, // preserve current email
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    }
  };


  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/)) {
      newErrors.password =
        "Password must have 8 characters, uppercase, lowercase, number, and special character";
    }
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.department) newErrors.department = "Department is required";
    if (!form.degree) newErrors.degree = "Degree is required";
    if (!form.collegeName) newErrors.collegeName = "College name is required";
    if (!isSiddharathaStudent && (!form.firstName || !form.lastName))
      newErrors.name = "First and Last name required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.text();
    alert(result);
    if (response.ok) navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
        {errors.email && <p className="error">{errors.email}</p>}

        <input name="collegeName" placeholder="College Name" onChange={handleChange} value={form.collegeName} disabled={isSiddharathaStudent} />
        <input name="studentId" placeholder="Student ID" onChange={handleChange} value={form.studentId} disabled={isSiddharathaStudent} />

        <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} disabled={isSiddharathaStudent} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} disabled={isSiddharathaStudent} />
        {errors.name && <p className="error">{errors.name}</p>}

        <input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />
        <input name="department" placeholder="Department" onChange={handleChange} value={form.department} />
        <input name="degree" placeholder="Degree" onChange={handleChange} value={form.degree} />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
        {errors.password && <p className="error">{errors.password}</p>}

        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} value={form.confirmPassword} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

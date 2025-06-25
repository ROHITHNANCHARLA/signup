import React, { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  email: string;
  collegeName: string;
  studentId: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  degree: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function Signup(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormData>({
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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const isSiddharathaStudent: boolean = form.email.endsWith("@siddharatha.co.in");

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
              email: value, // maintain user-typed email
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/)) {
      newErrors.password = "Password must have 8 characters, uppercase, lowercase, number, and special character";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.department) newErrors.department = "Department is required";
    if (!form.degree) newErrors.degree = "Degree is required";
    if (!form.collegeName) newErrors.collegeName = "College name is required";
    if (!isSiddharathaStudent && (!form.firstName || !form.lastName)) {
      newErrors.name = "First and Last name required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.text();
      alert(result);
      if (response.ok) navigate("/login");
    } catch (error) {
      alert("Error submitting form.");
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="Enter email" onChange={handleChange} value={form.email} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>College Name</label>
          <input name="collegeName" placeholder="Enter college name" onChange={handleChange} value={form.collegeName} disabled={isSiddharathaStudent} />
        </div>

        <div className="form-group">
          <label>Student ID</label>
          <input name="studentId" placeholder="Enter student ID" onChange={handleChange} value={form.studentId} disabled={isSiddharathaStudent} />
        </div>

        <div className="row">
          <div className="col">
            <label>First Name</label>
            <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} disabled={isSiddharathaStudent} />
          </div>
          <div className="col">
            <label>Last Name</label>
            <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} disabled={isSiddharathaStudent} />
          </div>
        </div>
        {errors.name && <p className="error">{errors.name}</p>}

        <div className="form-group">
          <label>Phone</label>
          <input name="phone" placeholder="Phone number" onChange={handleChange} value={form.phone} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="row">
          <div className="col">
            <label>Department</label>
            <input name="department" placeholder="Department" onChange={handleChange} value={form.department} />
            {errors.department && <p className="error">{errors.department}</p>}
          </div>
          <div className="col">
            <label>Degree</label>
            <input name="degree" placeholder="Degree" onChange={handleChange} value={form.degree} />
            {errors.degree && <p className="error">{errors.degree}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} value={form.confirmPassword} />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

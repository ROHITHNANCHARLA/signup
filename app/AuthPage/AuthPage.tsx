import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./AuthPage.css";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  collegeName?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface ErrorState {
  [key: string]: string;
}

type Mode = "signup" | "login";

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

function SignupForm({ form, errors, isSIDHARTHStudent, handleChange }: any) {
  return (
    <>
      <label>College Name</label>
      <input name="collegeName" value={form.collegeName || ""} onChange={handleChange} type="text" disabled={isSIDHARTHStudent} />
      {errors.collegeName && <p className="error">{errors.collegeName}</p>}

      {isSIDHARTHStudent && (
        <>
          <label>Student ID</label>
          <input name="studentId" value={form.studentId || ""} onChange={handleChange} type="text" disabled={isSIDHARTHStudent} />
          {errors.studentId && <p className="error">{errors.studentId}</p>}
        </>
      )}

      <div className="row">
        <div className="col">
          <label>First Name</label>
          <input name="firstName" value={form.firstName || ""} onChange={handleChange} type="text" disabled={isSIDHARTHStudent} />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="col">
          <label>Last Name</label>
          <input name="lastName" value={form.lastName || ""} onChange={handleChange} type="text" disabled={isSIDHARTHStudent} />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
      </div>

      <label>Date of Birth</label>
      <input name="dob" value={form.dob || ""} onChange={handleChange} type="date" disabled={isSIDHARTHStudent} />
      {errors.dob && <p className="error">{errors.dob}</p>}

      <label>Phone Number</label>
      <input name="phone" value={form.phone || ""} onChange={handleChange} type="tel" />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <label>Street Address 1</label>
      <input name="address1" value={form.address1 || ""} onChange={handleChange} type="text" />
      {errors.address1 && <p className="error">{errors.address1}</p>}

      <label>Street Address 2</label>
      <input name="address2" value={form.address2 || ""} onChange={handleChange} type="text" />

      <div className="row">
        <div className="col">
          <label>City</label>
          <input name="city" value={form.city || ""} onChange={handleChange} type="text" />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="col">
          <label>State</label>
          <input name="state" value={form.state || ""} onChange={handleChange} type="text" />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="col">
          <label>Zip Code</label>
          <input name="zip" value={form.zip || ""} onChange={handleChange} type="text" />
          {errors.zip && <p className="error">{errors.zip}</p>}
        </div>
      </div>

      <label>Password</label>
      <input name="password" value={form.password} onChange={handleChange} type="password" required />
      {errors.password && <p className="error">{errors.password}</p>}

      <label>Confirm Password</label>
      <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
    </>
  );
}

export default function AuthPage() {
  const [form, setForm] = useState<FormData>({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<ErrorState>({});
  const [mode, setMode] = useState<Mode>("signup");
  const [isSIDHARTHStudent, setIsSIDHARTHStudent] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (value.endsWith("@siddhartha.co.in")) {
        setIsSIDHARTHStudent(true);
        setForm((prev) => ({
          ...prev,
          firstName: "First Name from DB",
          lastName: "Last Name from DB",
          studentId: "SIDHARTH12345",
          collegeName: "SIDDHARTHA College",
          dob: "2002-01-01",
        }));
      } else {
        setIsSIDHARTHStudent(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};
    if (!form.email) newErrors.email = "Email is required";
    
    if (mode === "signup") {
      if (!form.collegeName) newErrors.collegeName = "College name is required";
      if (isSIDHARTHStudent && !form.studentId) newErrors.studentId = "Student ID is required";
      if (!isSIDHARTHStudent) {
        if (!form.firstName) newErrors.firstName = "First name is required";
        if (!form.lastName) newErrors.lastName = "Last name is required";
        if (!form.dob) newErrors.dob = "Date of birth is required";
      }
      if (!form.phone) newErrors.phone = "Phone number is required";
      if (!form.address1) newErrors.address1 = "Street address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.state) newErrors.state = "State is required";
      if (!form.zip) newErrors.zip = "Zip code is required";
      if (!validatePassword(form.password)) newErrors.password = "Password must include uppercase, lowercase, number, special char, and be at least 8 characters long";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const users: FormData[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (mode === "signup") {
      const exists = users.find((u) => u.email === form.email);
      if (exists) {
        alert("User already exists");
        return;
      }
      localStorage.setItem("registeredUsers", JSON.stringify([...users, form]));
      alert("Signup successful");
    } else {
      const matched = users.find((u) => u.email === form.email && u.password === form.password);
      if (matched) {
        alert("Login successful");
      } else {
        alert("Invalid email or password");
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>{mode === "signup" ? "SIDHARTH College - Signup Page" : "Login Page"}</h2>

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} type="email" required />
        {errors.email && <p className="error">{errors.email}</p>}

        {mode === "signup" ? (
          <SignupForm form={form} errors={errors} isSIDHARTHStudent={isSIDHARTHStudent} handleChange={handleChange} />
        ) : (
          <>
            <label>Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" required />
            {errors.password && <p className="error">{errors.password}</p>}
          </>
        )}

        <button type="submit">{mode === "signup" ? "Sign Up" : "Login"}</button>

        <p onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="toggle-mode">
          {mode === "signup" ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}

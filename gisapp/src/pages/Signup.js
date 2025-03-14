import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Failed to sign up.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl h-auto w-96 flex flex-col justify-evenly p-6">
        <div className="text-white text-center font-extrabold text-xl mb-4">Welcome!</div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full" required />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-6 font-semibold mt-6">
            Sign Up
          </button>
        </form>
        <Link to="/login"><div className="text-white text-center mt-4">Already have an account? <u className="text-blue-300 hover:text-blue-400">Sign In</u></div></Link>
      </div>
    </div>
  );
}

export default Signup;

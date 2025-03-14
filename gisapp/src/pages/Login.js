import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        navigate("/map");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Failed to login.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl h-96 w-96 flex flex-col justify-evenly p-6">
        <div className="text-white text-center font-extrabold text-xl">Welcome Back!</div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md"
            required
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-6 font-semibold mt-4">
            Login
          </button>
        </form>
        <Link to="/signup">
          <div className="text-white text-center mt-4">Don't have an account? <u className="text-blue-300 hover:text-blue-400">Create Account</u></div>
        </Link>
      </div>
    </div>
  );
}

export default Login;

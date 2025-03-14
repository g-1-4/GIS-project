import React from 'react';
import { Link } from 'react-router-dom';

function SignIn() {
  const handleLogin = () => {
    // Redirect to the React backend (gisapp)
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col p-6 bg-white/10 backdrop-blur-lg rounded-xl h-96 w-96 justify-evenly">
        <div className="text-xl font-extrabold text-center text-white">
          Welcome Back!
        </div>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="emailID-SignIn"
            id="emailID-SignIn"
            placeholder="Email"
            className="h-10 pl-4 placeholder-gray-800 bg-gray-100 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="password-SignIn"
            id="password-SignIn"
            placeholder="Password"
            className="h-10 pl-4 placeholder-gray-800 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <button
          className="px-6 py-2 mt-4 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={handleLogin}
        >
          Login
        </button>
        <Link to="/signup">
          <div className="mt-4 text-center text-white">
            Don't have an account?{' '}
            <u className="text-blue-300 hover:text-blue-400">Create Account</u>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;

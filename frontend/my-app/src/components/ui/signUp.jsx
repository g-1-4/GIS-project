import React from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  const handleLogin = () => {
    // Redirect to the React backend (gisapp)
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col h-auto p-6 bg-white/10 backdrop-blur-lg rounded-xl w-96 justify-evenly">
        <div className="mb-4 text-xl font-extrabold text-center text-white">
          Welcome!
        </div>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="emailID-SignUp"
            id="emailID-SignUp"
            placeholder="Email"
            className="w-full h-10 pl-4 placeholder-gray-800 bg-gray-100 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="password-SignUp"
            id="password-SignUp"
            placeholder="Password"
            className="w-full h-10 pl-4 placeholder-gray-800 bg-gray-100 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="ConfirmPassword-SignUp"
            id="ConfirmPassword-SignUp"
            placeholder="Confirm password"
            className="w-full h-10 pl-4 placeholder-gray-800 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <button
          className="px-6 py-2 mt-6 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={handleLogin}
        >
          Sign Up
        </button>
        <Link to="/signin">
          <div className="mt-4 text-center text-white">
            Already have an account?{' '}
            <u className="text-blue-300 hover:text-blue-400">Sign In</u>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;

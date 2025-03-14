import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full h-16 bg-gradient-to-b from-black to-black/10 flex flex-row justify-between items-center">
      <div className="flex items-center justify-center w-72 h-16 text-white">(Logo)</div>
      <div className="flex items-center justify-center w-90 h-16 font-bold text-4xl text-white">
        Land Parcel Management
      </div>
      <div className="flex flex-row items-center justify-evenly w-72 h-16 pr-6">
        <Link to="/">
          <div className="w-20 flex items-center justify-center font-bold text-white hover:text-green-500">
            Home
          </div>
        </Link>
        <Link to="/login">
          <div className="w-20 flex items-center justify-center font-bold text-white hover:text-green-500">
            Sign In
          </div>
        </Link>
        <Link to="/signup">
          <div className="w-20 flex items-center justify-center font-bold text-white hover:text-green-500">
            Sign Up
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between w-full h-16 bg-gradient-to-b from-black to-black/10">
      <div className="flex items-center justify-center h-16 text-white w-72">(Logo)</div>
      <div className="flex items-center justify-center h-16 text-3xl font-bold text-white w-90">Land Parcel Management</div>
      <div className="flex flex-row items-center h-16 pr-6 justify-evenly w-72">
        <Link to="/">
          <div className="flex items-center justify-center w-20 font-bold text-white hover:text-green-500">
            Home
          </div>
        </Link>
        <Link to="/signin">
          <div className="flex items-center justify-center w-20 font-bold text-white hover:text-green-500">
            Sign In
          </div>
        </Link>
        <Link to="/signup">
          <div className="flex items-center justify-center w-20 font-bold text-white hover:text-green-500">
            Sign Up
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;

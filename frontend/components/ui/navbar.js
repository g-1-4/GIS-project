import React from "react";
import Link from 'next/link';

function navbar(){
    return(
        <>
        <div className="w-full h-16 bg-blue-600 text-white flex flex-row justify-evenly items-center">
            <div className=" flex items-center justify-center w-72 h-16">(Logo)</div>
            <div className=" flex items-center justify-center  w-72 h-16 font-bold text-xl">GIS Land Parcel</div>
            <div className=" flex flex-row items-center justify-evenly  w-72 h-16">
                <Link href="/">
                <div className=" w-20 flex items-center justify-center font-bold  ">Home</div>
                </Link>
                <Link href="/SignIn">
                <div className=" w-20 flex items-center justify-center font-bold ">Sign In</div>
                </Link>
                <Link href="/SignUp">
                <div className=" w-20 flex items-center justify-center font-bold ">Sign Up</div>
                </Link>
            </div>
        </div>
        </>
    )
}

export default navbar;
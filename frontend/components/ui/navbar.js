import React from "react";
import Link from 'next/link';

function navbar() {
    return (
        <>
            <div className="w-full h-16 bg-gradient-to-b from-black to to-black/10   flex flex-row justify-between items-center">
                <div className=" flex items-center justify-center w-72 h-16 text-white">(Logo)</div>
                <div className=" flex items-center justify-center  w-72 h-16 font-bold text-4xl text-white ">GIS Land Parcel</div>
                <div className=" flex flex-row items-center justify-evenly  w-72 h-16 pr-6">
                    <Link href="/">
                        <div className=" w-20 flex items-center justify-center font-bold text-white hover:text-green-500 ">Home</div>
                    </Link>
                    <Link href="/SignIn">
                        <div className=" w-20 flex items-center justify-center font-bold text-white hover:text-green-500 ">Sign In</div>
                    </Link>
                    <Link href="/SignUp">
                        <div className=" w-20 flex items-center justify-center font-bold text-white hover:text-green-500 ">Sign Up</div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default navbar;
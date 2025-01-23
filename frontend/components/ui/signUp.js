// import React from 'react'
// import Link from 'next/link';

// function signUp() {
//     return (
//         <>
//             <div className='w-full h-full flex pt-28 justify-center '>
//                 <div className='bg-white border rounded-lg h-96 w-96 flex flex-col space-y-4'>
//                     <div className=' flex items-center justify-center   text-gray-900  h-9 font-extrabold text-lg pt-8'>Welcome!</div>
//                     <div className=' h-16 flex flex-col   pt-2 pl-4 pr-4'>
//                         <label htmlFor="emaidID-SignUp" className='text-m text-gray-900'>Email:</label>
//                         <input type="text" name="emailID-SignUp" id="emailID-SignUp" placeholder='Enter your email' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-400 rounded-md' />
//                     </div>
//                     <div className=' h-16 flex flex-col  pt-2 pl-4 pr-4'>
//                         <label htmlFor="password-SignUp" className='text-m text-gray-900' >Password:</label>
//                         <input type="text" name="password-SignUp" id="password-SignUp" placeholder='Enter your password' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-400 rounded-md' />
//                     </div>
//                     <div className=' h-16 flex flex-col  pt-2 pl-4 pr-4'>
//                         <label htmlFor="ConfirmPassword-SignUp" className='text-m text-gray-900' > Confirm Password:</label>
//                         <input type="text" name="ConfirmPassword-SignUp" id="ConfirmPassword-SignUp" placeholder='Confirm your password' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-400 rounded-md' />
//                     </div>
//                     <button>
//                         <div className=' flex items-center justify-center h-8 text-black'>
//                             <div className='bg-green-500 w-24 h-8 flex items-center justify-center border rounded-md'>
//                                 Sign Up
//                             </div></div>
//                     </button>
//                     <Link href="/SignIn">
//                     <div className=' flex items-center justify-center  text-blue-500 '>Already have an account?<u>Sign In</u></div>
//                     </Link>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default signUp
"use client"
import React from 'react';
import Link from 'next/link';

function signUp() {

    const handleLogin = () => {
        // Redirect to the React backend (gisapp)
        window.location.href = 'http://localhost:3000';
    };
    return (
        <div className="w-screen h-screen flex items-center justify-center ">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl h-auto w-96 flex flex-col justify-evenly p-6">
                <div className="text-white text-center font-extrabold text-xl mb-4">
                    Welcome!
                </div>
                <div className="flex flex-col space-y-4">
                    <div>
                        {/* <label
              htmlFor="emailID-SignUp"
              className="block text-sm text-white mb-1"
            >
              Email:
            </label> */}
                        <input
                            type="text"
                            name="emailID-SignUp"
                            id="emailID-SignUp"
                            placeholder="Email"
                            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full"
                        />
                    </div>
                    <div>
                        {/* <label
              htmlFor="password-SignUp"
              className="block text-sm text-white mb-1"
            >
              Password:
            </label> */}
                        <input
                            type="password"
                            name="password-SignUp"
                            id="password-SignUp"
                            placeholder="Password"
                            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full"
                        />
                    </div>
                    <div>
                        {/* <label
              htmlFor="ConfirmPassword-SignUp"
              className="block text-sm text-white mb-1"
            >
              Confirm Password:
            </label> */}
                        <input
                            type="password"
                            name="ConfirmPassword-SignUp"
                            id="ConfirmPassword-SignUp"
                            placeholder="Confirm password"
                            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md w-full"
                        />
                    </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-6 font-semibold mt-6" onClick={handleLogin}>
                    Sign Up
                </button>
                <Link href="/SignIn">
                    <div className="text-white text-center mt-4">
                        Already have an account?{' '}
                        <u className="text-blue-300 hover:text-blue-400">Sign In</u>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default signUp;

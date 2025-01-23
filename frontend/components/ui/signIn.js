// import React from 'react';
// import Link from 'next/link';

// function signIn() {
//   return (
//     <>
//         <div className='w-full h-full flex pt-28 justify-center '>
//             <div className='bg-white/10 backdrop-blur-lg  rounded-xl h-60 w-96 flex flex-col justify-evenly'>
//                 <div className=' flex items-center justify-center   text-white  h-9 font-extrabold text-lg '>Welcome Back!</div>
//                 <div className=' h-16 flex flex-col    pl-4 pr-4'>
//                     {/* <label htmlFor="emaidID-SignIn" className='text-m text-white'>Email:</label> */}
//                     <input type="text" name="emailID-SignIn" id="emailID-SignIn" placeholder='Email' className=' pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md' />
//                 </div>
//                 <div className=' h-16 flex flex-col   pl-4 pr-4'>
//                     {/* <label htmlFor="password-SignIn" className='text-m text-white' >Password:</label> */}
//                     <input type="text" name="password-SignIn" id="password-SignIn" placeholder='Password' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md' />
//                 </div>

//                 <button>
//                     <div className=' flex items-center justify-center h-8 text-black'>
//                         <div className='bg-green-500 w-24 h-8 flex items-center justify-center  rounded-md'>
//                             Login
//                         </div></div>
//                 </button>
//                 <Link href="/SignUp">
//                 <div className=' flex items-center justify-center  text-white '>Don't have an account?<u className='text-green-300'>Create Account</u></div>
//                 </Link>
//             </div>
//         </div>
//     </>
// )
// }

// export default signIn
"use client"
import React from 'react';
import Link from 'next/link';

function signIn() {

  const handleLogin = () => {
    // Redirect to the React backend (gisapp)
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl h-96 w-96 flex flex-col justify-evenly p-6">
        <div className="text-white text-center font-extrabold text-xl ">
          Welcome Back!
        </div>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="emailID-SignIn"
            id="emailID-SignIn"
            placeholder="Email"
            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md"
          />
          <input
            type="password"
            name="password-SignIn"
            id="password-SignIn"
            placeholder="Password"
            className="pl-4 h-10 border border-gray-300 bg-gray-100 placeholder-gray-800 rounded-md"
          />
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-6 font-semibold mt-4 " onClick={handleLogin}>
          Login
        </button>
        <Link href="/SignUp">
          <div className="text-white text-center mt-4">
            Don't have an account?{' '}
            <u className="text-blue-300 hover:text-blue-400">Create Account</u>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default signIn;

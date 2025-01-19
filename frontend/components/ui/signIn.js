import React from 'react';
import Link from 'next/link';

function signIn() {
  return (
    <>
        <div className='w-full h-full flex pt-28 justify-center bg-gray-200'>
            <div className='bg-white border rounded-lg h-80 w-96 flex flex-col space-y-4'>
                <div className=' flex items-center justify-center   text-gray-900  h-9 font-extrabold text-lg pt-8'>Welcome Back!</div>
                <div className=' h-16 flex flex-col   pt-2 pl-4 pr-4'>
                    <label htmlFor="emaidID-SignIn" className='text-m text-gray-900'>Email:</label>
                    <input type="text" name="emailID-SignIn" id="emailID-SignIn" placeholder='Enter your email' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-400 rounded-md' />
                </div>
                <div className=' h-16 flex flex-col  pt-2 pl-4 pr-4'>
                    <label htmlFor="password-SignIn" className='text-m text-gray-900' >Password:</label>
                    <input type="text" name="password-SignIn" id="password-SignIn" placeholder='Enter your password' className='pl-2 h-8 border border-gray-300 bg-gray-100 placeholder-gray-400 rounded-md' />
                </div>
                
                <button>
                    <div className=' flex items-center justify-center h-8 text-black'>
                        <div className='bg-green-500 w-24 h-8 flex items-center justify-center border rounded-md'>
                            Login
                        </div></div>
                </button>
                <Link href="/SignUp">
                <div className=' flex items-center justify-center  text-blue-500 '>Don't have an account?<u>Create Account</u></div>
                </Link>
            </div>
        </div>
    </>
)
}

export default signIn
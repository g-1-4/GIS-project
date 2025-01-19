import React from 'react'
import Navbar from '@/components/ui/navbar'
import SignUp from '@/components/ui/signUp'

function page() {
  return (
    <>
    <div className='flex flex-col h-screen overflow-hidden'>
        <Navbar/>
        <SignUp/>   
    </div>
    </>
  )
}

export default page
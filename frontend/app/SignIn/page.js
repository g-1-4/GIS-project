import React from 'react'
import Navbar from '@/components/ui/navbar'
import SignIn from '@/components/ui/signIn'

function page() {
  return (
    <>
    <div className='flex flex-col h-screen overflow-hidden'>
        <Navbar/>
        <SignIn/>   
    </div>
    </>
  )
}

export default page
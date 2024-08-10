"use client"
import React from 'react'
import Logout from '../components/Logout'
import { useSession } from 'next-auth/react'

const page =  () => {
  const { data: session, status } = useSession();
console.log( session, status);
  
  return (
    <div className="bg-red-500">
    <h1 className="text-white">Welcome,</h1>
    <Logout />
  </div>
  )
}

export default page
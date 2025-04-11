"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Sidebar } from 'lucide-react'
import SideNav from './SideNav'
function Header({setIsOpen  , isOpen}) { 
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  
  const handleToggle = () => {
     setIsOpen(!isOpen);
  }
  return (
    <>
    <div className='flex justify-between items-center p-4 bg-white shadow-md'>
      <div className='flex items-center gap-5 justify-between'>
        {
          !isOpen && <Sidebar className='cursor-pointer transition-all duration-300 ease-in-out text-indigo-900'onClick={()=>{handleToggle()}}/>
        }
      <h2 className='text-blue-900 font-bold text-xl cursor-pointer' onClick={() => router.replace("/")} >eXpensifyX</h2>
      {/* <Image
        src="/logo2.png"
        alt="logo"
        width={50}
        height={50}
        className="cursor-pointer"
        
      /> */}
      </div>
      
      {isSignedIn ? <UserButton /> : <Link href="/sign-in"><Button >Sign In</Button></Link>}
      
    </div>
    {/* {
      isOpen && 
      
        <SideNav isOpen={isOpen} />
      
    } */}
    </>
  )
}

export default Header

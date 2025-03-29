"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
function Header() {
    const {user, isSignedIn} = useUser();
  return (
    <div className='flex justify-between items-center p-4 bg-gray-100 shadow-md'>
      <Image src={'./logoipsum-243.svg'} alt="logo" width={160} height={100} />
      {isSignedIn? <UserButton/> : <Link href="/sign-in"><Button >Sign In</Button></Link>}
     
    </div>
  )
}

export default Header

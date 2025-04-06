"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  return (
    <div className='flex justify-between items-center p-4 bg-gray-100 shadow-md'>
      <div className='flex items-center gap-3 justify-between cursor-pointer hover:shadow-sm hover:bg-blue-100 rounded-lg px-5' onClick={() => router.replace("/")}>
      <Image
        src="/logo2.png"
        alt="logo"
        width={50}
        height={50}
        className="cursor-pointer"
        
      />
      <h2 className='text-blue-900 font-bold text-xl'>eXpensifyX</h2>
      </div>
      
      
      {isSignedIn ? <UserButton /> : <Link href="/sign-in"><Button >Sign In</Button></Link>}
      
    </div>
  )
}

export default Header

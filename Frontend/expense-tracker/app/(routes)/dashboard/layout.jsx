"use client"
import React, { useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { Budgets } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'
function DashboardLayout({ children }) {
  const user = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    user && checkUserBudgets()
  }, [user])
  const checkUserBudgets = async () => {
    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) 

    //console.log(result)
    // if(result?.length==0)
    // {
    //     router.replace('/dashboard/budgets')
    // }
  }
  return (
    <div className='flex'>
      {isOpen && <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div className={`flex-1 transition-all duration-500 ${isOpen ? "ml-64" : "ml-0"}`}>
        <DashboardHeader setIsOpen={setIsOpen} isOpen={isOpen} />
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout

"use client"
import { UserButton } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {
    const path = usePathname()

    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        }
    ]
    return (
        <>
            <div className='flex flex-col gap-3 h-screen border shadow-sm p-1'>
                <div className=''>
                    <Image src={'/logoipsum-243.svg'} alt="logo" width={160} height={100} className='p-5 ' />
                </div>
                <div className='mt-2 h-fit'>
                   
                    {
                        menuList.map((menu,index) => {
                            return <Link key={index} href={menu.path}>
                             <h2 key={menu.id} 
                                    className={`flex gap-2 items-center text-gray-600 font-medium p-2 cursor-pointer rounded-md hover:text-primary hover:bg-blue-200
                                                ${path==menu.path && 'text-primary bg-blue-200'} `}>
                                <menu.icon />
                                {menu.name}
                            </h2>
                            </Link>
})
                    }
                </div>
                <div className='fixed bottom-10 p-5 cursor-pointer gap-2 flex items-center'>
                    <UserButton/>
                    Profile
                </div>
            </div>

        </>
    )
}

export default SideNav

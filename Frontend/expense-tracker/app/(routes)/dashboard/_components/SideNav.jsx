"use client"
import { UserButton } from '@clerk/nextjs'
import { Calendar, LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav({ isOpen, setIsOpen }) {
    const path = usePathname()
    //console.log(isOpen)
    const handleToggle = () => {
        setIsOpen(!isOpen);
     }
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
            path: '/dashboard/expensespage'
        },
        {
            id: 4,
            name: 'Monthly Analysis',
            icon: Calendar,
            path: '/dashboard/monthlyanalysis'
        }
    ]
    return (

        <div className={`fixed w-64 flex flex-col gap-3 h-screen shadow-md p-2 bg-white transition-all duration-500 transform ease-in-out ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-50"}`}>
            {
                isOpen && <div className='flex p-2 justify-end'>
                    <X  onClick={()=> {handleToggle()}} className='text-gray-600 cursor-pointer hover:text-gray-950 ' />
                </div>
            }
            {menuList.map((menu) => (
                <Link key={menu.id} href={menu.path} className="no-underline">
                    <h2 className={`flex gap-2 items-center text-gray-600 font-medium p-2 cursor-pointer rounded-md hover:text-primary hover:bg-blue-200
                                    ${path === menu.path && 'text-primary bg-blue-200'}`}>
                        <menu.icon />
                        {menu.name}
                    </h2>
                </Link>
            ))}
        </div>
    )
}

export default SideNav

import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {
    const calculateProgress = () => {
        const perc = (budget.totalSpend/budget.amount)*100
        return perc.toFixed(2)
    }
    return (
        <Link href={'/dashboard/expenses/'+budget?.id} >
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
            <div className=''>
                <div className='flex flex-col gap-2 items-center justify-between'>
                   <div className='flex w-full justify-between items-center'>
                   <div className='flex gap-2'>
                    <h2 className='text-2xl p-3 bg-slate-100 rounded-full h-12 w-12'>{budget?.icon}</h2>
                    <div>
                        <h2 className='font-bold text-slate-800'>{budget.name}</h2>
                        <h2 className='text-sm text-gray-500'>{budget.totalItem} Items</h2>
                    </div>
                    </div>
                    <div>
                        <h2 className='font-bold text-lg text-indigo-900'>${budget.amount}</h2>
                    </div>
                   </div>
                    <div className='mt-5 w-full flex flex-col items-center'>
                        <div className='w-[100%] flex items-center justify-between mb-3'>
                            <h2 className='text-xs text-slate-600'>${budget.totalSpend?budget.totalSpend:0} Spent</h2>
                            <h2 className='text-xs text-indigo-900'>${budget.amount-budget.totalSpend} Remaining</h2>
                        </div>
                        <div className='w-full bg-slate-300 h-2 rounded-full'>
                           <div className=' bg-indigo-900 h-2 rounded-full' style={{width:`${calculateProgress()}%`}}>

                           </div>
                        </div>
                    </div>

                </div>
            </div>
            </div>
        </Link>
    )
}

export default BudgetItem

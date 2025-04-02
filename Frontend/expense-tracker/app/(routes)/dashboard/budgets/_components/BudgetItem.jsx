import React from 'react'

function BudgetItem({ budget }) {
    return (
        <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer'>
            <div className=''>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2'>
                    <h2 className='text-2xl p-3 bg-slate-100 rounded-full h-12 w-12'>{budget?.icon}</h2>
                    <div>
                        <h2 className='font-bold text-slate-800'>{budget.name}</h2>
                        <h2 className='text-sm text-gray-500'>{budget.totalItem} Items</h2>
                    </div>
                    </div>
                    <div>
                        <h2 className='font-bold text-lg text-indigo-600'>${budget.amount}</h2>
                    </div>
                    <div className='mt-5'>
                        <div className='flex items-center justify-normal mb-3 flex-col'>
                            <h2 className='text-xs text-slate-600'>${budget.totalSpend?budget.totalSpend:0} Spent</h2>
                            <h2 className='text-xs text-indigo-600'>${budget.amount-budget.totalSpend} Remaining</h2>
                        </div>
                        <div className='w-full bg-slate-300 h-2 rounded-full'>
                           <div className='w-[40%] bg-indigo-600 h-2 rounded-full'>

                           </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BudgetItem

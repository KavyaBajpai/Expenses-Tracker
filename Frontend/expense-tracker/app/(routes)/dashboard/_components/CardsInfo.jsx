import { PiggyBank, Receipt, Wallet } from 'lucide-react'
import React from 'react'
import { useEffect, useState } from 'react'
import { db } from '@/utils/dbConfig'

function CardsInfo({budgetList}) {
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpend, setTotalSpend] = useState(0)
  const currentMonth = new Date().getMonth() + 1;
  //console.log({budgetList})
  const calcCardInfo = () => {
      //console.log("hello from cardsInfo.jsx")
      
      let totalBudget_=0
      let totalSpend_ =0
      budgetList.forEach( element => {
         totalBudget_ = totalBudget_ + Number(element.amount)
         totalSpend_ = totalSpend_ + element.totalSpend
      })
      setTotalBudget( totalBudget_ )
      setTotalSpend( totalSpend_)
  }

  useEffect(() => {
    budgetList&&calcCardInfo()
 })
  
  return (
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <div className='p-7 border rounded-lg'>
        <div className='flex items-center justify-between'>
        <h2 className='text-sm'>Total Budget</h2>
        <h2 className='text-2xl font-bold'>${totalBudget}</h2>
        </div>
        <PiggyBank className='bg-indigo-900 p-3 h-12 w-12 rounded-full text-white'/>
      </div>

      <div className='p-7 border rounded-lg'>
        <div className='flex items-center justify-between'>
        <h2 className='text-sm'>Amount Spent</h2>
        <h2 className='text-2xl font-bold'>${totalSpend}</h2>
        </div>
        <Receipt className='bg-indigo-900 p-3 h-12 w-12 rounded-full text-white'/>
      </div>

      <div className='p-7 border rounded-lg'>
        <div className='flex items-center justify-between'>
        <h2 className='text-sm'>Amount Remaining</h2>
        <h2 className='text-2xl font-bold'>${totalBudget - totalSpend}</h2>
        </div>
        <Wallet className='bg-indigo-900 p-3 h-12 w-12 rounded-full text-white'/>
      </div>

      {/* <div className='p-7 border rounded-lg'>
        <div className='flex items-center justify-between'>
        <h2 className='text-sm'>No. of Budgets</h2>
        <h2 className='text-2xl font-bold'>${budgetList.length}</h2>
        </div>
        <Wallet className='bg-indigo-600 p-3 h-12 w-12 rounded-full text-white'/>
      </div> */}
    </div>
  )
}

export default CardsInfo

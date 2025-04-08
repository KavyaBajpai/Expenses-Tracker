"use client"
import React, { useEffect, useState } from 'react'

import Input from './_components/Input'
import PieChartRender from './_components/PieChart'
import Savings from './_components/Savings'

function page() {
  const [month, setMonth] = useState()
  
  useEffect(()=>{
    console.log("month:", month)
  },[month])
  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold mb-6'>My Monthly Analysis</h2>
      <Input className='mt-4' month={month} setMonth={setMonth} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <PieChartRender month={month}/>
        </div>
        <div className='md:col-span-1'>
          <Savings />
        </div>
      </div>
    </div>
  )
}

export default page

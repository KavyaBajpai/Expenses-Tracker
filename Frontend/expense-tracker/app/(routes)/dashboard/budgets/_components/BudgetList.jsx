"use client"
import React, { useEffect, useState} from 'react'
import CreateBudget from './CreateBudget'
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@/utils/schema'
import BudgetItem from './BudgetItem'
function BudgetList() {
  const currentMonth = new Date().getMonth() + 1;
  const [budgetList, setBudgetList] = useState([])
  const {user} = useUser();
  useEffect(() => {
    getBudgetList()
  },[user])
  const getBudgetList = async () => {
   
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount}::integer)`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user.id))
    .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${currentMonth}`)
    .groupBy(Budgets.id)
     setBudgetList(result);
     console.log("hi")
    console.log(result)
  }
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
           <CreateBudget refreshData={()=>getBudgetList()}/>
           {budgetList?.length>0 ? budgetList.map((budget,index)=>(
            <BudgetItem budget={budget} key={index}/>
           ))
          : [1,2,3,4,5,6].map((frame,index)=>(
            <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'></div>
          ))}
        </div>
    </div>
  )
}

export default BudgetList

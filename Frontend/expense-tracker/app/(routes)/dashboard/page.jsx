"use client"
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import CardsInfo from './_components/CardsInfo';
import { useEffect, useState } from 'react'
import { sql, eq, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { db } from '@/utils/dbConfig'
import { getTableColumns } from 'drizzle-orm/utils';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import { Rock_3D } from 'next/font/google';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
function Dashboard() {

  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([])
  const [expensesList, setExpensesList] = useState([])
  

  useEffect(() => {
    getBudgetList()
  }, [user])
  const getBudgetList = async () => {

    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount}::integer)`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets) 
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.id))
      .groupBy(Budgets.id)
      
    setBudgetList(result);
    expenseList()
    console.log("hi from page.jsx of dashboard")
    console.log("budgetlist is")
    console.log(result)
  }

  const expenseList = async () => {
     
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    }).from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId)) 
    .where(eq(Budgets.createdBy, user.id))
    .orderBy(desc(Expenses.createdAt))

    setExpensesList(result);
  }

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName}!</h2>
      <p className='text-gray-500 mt-2'>Let's dive in!</p>
      <CardsInfo budgetList={budgetList} />

      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expensesList={expensesList} refreshData={()=>{getBudgetList()}} />
        </div>
        
        <div className='grid gap-3'>
          
           <h2 className='font-bold text-lg'> Latest Budgets</h2>
            {budgetList.slice(0,3).map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Dashboard

"use client"
import { useUser } from '@clerk/nextjs'
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { Expenses, Budgets } from '@/utils/schema';
import { db } from '@/utils/dbConfig'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
function ExpensesScreen({params}) {
  
  useEffect(()=>{
    getBudgetInfo();
    getExpensesList();
  },[params])
  const {user} = useUser();
  const [budgetInfo, setBudgetInfo] = useState([])
  const [expensesList, setExpensesList] = useState([])
  const getBudgetInfo = async () => {
    const result = await db.select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(COALESCE(${Expenses.amount}::integer, 0))`.mapWith(Number),


          totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.id))
        .where(eq(Budgets.id, params.id))
        .groupBy(Budgets.id)
        console.log(result)
        console.log(user)
        setBudgetInfo(result[0])
        getExpensesList()
  }

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .orderBy(desc(Expenses.id))
    setExpensesList(result)
    console.log(result)
  }
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold'>My Expenses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-4'>
        
        {budgetInfo?
          <BudgetItem budget={budgetInfo} />
          : <div className='h-[150px] w-full bg-gray-300 rounded-lg animate-pulse'>
            </div>}
        <div>
        <AddExpense budgetId={params.id} user={user} refreshData={()=>{getBudgetInfo()}}/>
      </div>
      </div>
      <div className='mt-5'>
      <h2 className='text-2xl font-bold'>Latest Expenses</h2>
      <ExpenseListTable expensesList={expensesList} refreshData={()=>{getBudgetInfo()}} />
      </div>
      
      
    </div>
  )
}

export default ExpensesScreen

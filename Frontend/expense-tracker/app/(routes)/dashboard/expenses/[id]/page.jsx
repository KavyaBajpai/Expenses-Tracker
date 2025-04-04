"use client"
import { useUser } from '@clerk/nextjs'
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { Expenses, Budgets } from '@/utils/schema';
import { db } from '@/utils/dbConfig'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen({ params }) {

  useEffect(() => {
    getBudgetInfo();
    getExpensesList();
  }, [params])
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState([])
  const [expensesList, setExpensesList] = useState([])
  const route = useRouter()

  const deleteBudget = async () => {

    const deleteExpenseResult = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

    if (deleteExpenseResult) {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();

      console.log(result)
    }

    toast("Budget Deleted Successfully!");
    route.replace('/dashboard/budgets')
  }

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
    <div className='p-10 '>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold '>My Expenses</h2>
        <div className='flex justify-between gap-3'>
         <EditBudget budgetInfo={budgetInfo} refreshData={()=>(getBudgetInfo())} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2' variant="destructive"><Trash /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this budget
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { deleteBudget() }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-4'>

        {budgetInfo ?
          <BudgetItem budget={budgetInfo} />
          : <div className='h-[150px] w-full bg-gray-300 rounded-lg animate-pulse'>
          </div>}
        <div>
          <AddExpense budgetId={params.id} user={user} refreshData={() => { getBudgetInfo() }} />
        </div>
      </div>
      <div className='mt-5'>
        
        <ExpenseListTable expensesList={expensesList} refreshData={() => { getBudgetInfo() }} />
      </div>


    </div>
  )
}

export default ExpensesScreen

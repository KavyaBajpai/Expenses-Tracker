"use client"
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Budgets, Expenses } from '@/utils/schema'
import React from 'react'

import { eq, sql } from 'drizzle-orm'
import ExpenseList from './_components/ExpensesList'

function Page() {
    const [expensesList, setExpensesList] = useState([])
    const { user } = useUser()
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        if (user) {
            console.log("useeffect here")
            getExpenses();
        }
    }, [user])  // Depend on `user` to make sure it's available

    const getExpenses = async () => {
        try {
            const result = await db.select()
                .from(Expenses)
                .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
                .where(eq(Budgets.createdBy, user.id)) // Ensure user is defined
                .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${currentMonth}`)
            console.log("from current")
            console.log(result)

            setExpensesList(result);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl mb-4'>All Expenses</h2>
            <ExpenseList expensesList={expensesList} refreshData={getExpenses}/>
        </div>
    )
}

export default Page

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Expenses, Budgets} from '@/utils/schema'
import React, { useState } from 'react'
import { toast } from 'sonner'

function AddExpense({budgetId, user, refreshData}) {
    const [expenseName, setExpenseName] = useState()
    const [expenseAmount, setExpenseAmount] = useState()

    const addNewExpense =  async () => {
        
        const result = await db.insert(Expenses).values({
            name: expenseName,
            amount: expenseAmount,
            budgetId: budgetId,
            createdAt: new Date().toLocaleDateString()

        }).returning({insertedId: Budgets.id})
        setExpenseName('')
        setExpenseAmount('')

        console.log(result)
        if(result)
        {   setExpenseAmount('')
            setExpenseName('')
            refreshData()
            toast('New Expense Added')
        }
    }
    return (
        <div>
            <div className='border hover:shadow-md rounded-lg p-4'>
            <h2 className='content-center font-bold text-lg text-indigo-900'>Add Expense</h2>
            <div className='mt-1'>
                <h2 className='text-lg font-semi-bold mb-1'>Expense Name</h2>
                <Input placeholder="e.g. Stationery" onChange={(e) => setExpenseName(e.target.value)} />
            </div>
            <div className='mt-1'>
                <h2 className='text-lg font-semi-bold mb-1'>Expense Amount</h2>
                <Input placeholder="e.g $5000" onChange={(e) => setExpenseAmount(e.target.value)} />
            </div>
            <Button disabled={!(expenseName && expenseAmount)} onClick={()=>{ addNewExpense()}} className="mt-3 w-full bg-indigo-800">Add</Button>
            </div>
            

        </div>
    )
}

export default AddExpense

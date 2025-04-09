"use client"
import React, { useEffect, useState } from 'react'
import { Expenses, Budgets } from '@/utils/schema'
import { getTableColumns } from 'drizzle-orm/utils';
import { db } from '@/utils/dbConfig'
import { sql, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

function Savings({ month}) {
  const { user } = useUser()
  const prev1Month = month - 1 > 0 ? month - 1 : 0;
  const prev2Month = month - 2 > 0 ? month - 2 : 0;

  const [budgetList1, setBudgetList1] = useState([]);
  const [totalBudget1, setTotalBudget1] = useState(0);
  const [totalSpend1, setTotalSpend1] = useState(0);

  const [budgetList2, setBudgetList2] = useState([]);
  const [totalBudget2, setTotalBudget2] = useState(0);
  const [totalSpend2, setTotalSpend2] = useState(0);

  useEffect(() => {
    const fetchBudgetData = async (prevMonth, setBudgetList, setTotalBudget, setTotalSpend) => {
      try {
        const result = await db
          .select({
            ...getTableColumns(Budgets),
            totalSpend: sql`COALESCE(SUM(${Expenses.amount}::integer), 0)`.mapWith(Number),
          })
          .from(Budgets)
          .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user.id))
          .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${prevMonth}`)

          .groupBy(Budgets.id);
          //console.log(`Data for month ${prevMonth}:`, result); 
        setBudgetList(result);

        // Calculate total budget
        const budgetTotal = result.reduce((sum, budget) => sum + Number(budget.amount), 0);
        //console.log(`Total Budget for ${prevMonth}:`, budgetTotal);
        setTotalBudget(budgetTotal);

        // Calculate total spending
        const spendTotal = result.reduce((sum, budget) => sum + (budget.totalSpend || 0), 0);
        //console.log(`Total Spend for ${prevMonth}:`, spendTotal);
        setTotalSpend(spendTotal);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    if (prev1Month > 0) {
      fetchBudgetData(prev1Month, setBudgetList1, setTotalBudget1, setTotalSpend1);
    }

    if (prev2Month > 0) {
      fetchBudgetData(prev2Month, setBudgetList2, setTotalBudget2, setTotalSpend2);
    }
  }, [month, user]);

  return (
    <div className="bg-gray-100 rounded-lg p-5 border flex flex-col gap-8">
      <h2 className="font-bold text-xl mb-10">Savings</h2>
      <div className='flex justify-center items-center h-80 mb-4'>
      <Carousel className="w-full max-w-xs bg-gray-900 ">
        <CarouselContent className=' bg-gray-900 text-gray-100 border-none '>
          {prev1Month > 0 && (
            <CarouselItem className=' bg-gray-900 text-gray-100 border-none'>
              <div className="p-1">
                <Card className=' bg-gray-900 text-gray-100 border-none'>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-lg font-semibold">Last month</p>
                    <span className="text-4xl font-semibold">{totalBudget1 - totalSpend1}</span>
                    <span className="text-xl font-medium mt-6">Total Budget: {totalBudget1}</span>
                    <span className="text-xl font-medium">Total Spend: {totalSpend1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}

          {prev2Month > 0 && (
            <CarouselItem className=' bg-gray-900 text-gray-100 border-none '>
              <div className="p-1">
                <Card className=' bg-gray-900 text-gray-100 border-none '>
                  <CardContent className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 border-none">
                    <p className="text-lg font-semibold">Last to last month</p>
                    <span className="text-4xl font-semibold">{totalBudget2 - totalSpend2}</span>
                    <span className="text-xl font-medium mt-6">Total Budget: {totalBudget2}</span>
                    <span className="text-xl font-medium ">Total Spend: {totalSpend2}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>
      
    </div>
  );
}

export default Savings;

"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { sql } from 'drizzle-orm'
import { RefreshCcw } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

function PieChartRender({ month }) {
  const [budgetList, setBudgetList] = useState([])
  const { user } = useUser()
  const [chartData1, setChartData1] = useState([])
  const [loading, setLoading] = useState(false)

  const getBudgetList = async (month) => {
    setLoading(true)
    try {
      const monthNum = Number(month);
      const result = await db.select({
        name: Budgets.name,
        amount: Budgets.amount
      })
      .from(Budgets)
      .where(
        sql`"created_by" = ${user.id} AND
        EXTRACT(MONTH FROM "created_at")::integer = ${monthNum}`
      );
      
      console.log("API result:", result)
      setBudgetList(result)
      
      const chartData = result.map((budget, id) => ({
        name: budget.name,
        value: Math.abs(Number(budget.amount))
      }))
      console.log("Chart data:", Array.isArray(chartData), chartData);
      setChartData1(chartData)
    } catch (error) {
      console.error("Error fetching budget data:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch data when component mounts
  useEffect(() => {
    if (user) {
      getBudgetList(month)
    }
  }, [user, month])
  
  return (
    <div className='bg-gray-100 border rounded-lg p-5'>
      <div className='flex justify-between items-center'>
      <h2 className='font-bold text-xl mb-4'>Budget Breakdown</h2>
      <Button onClick={() => getBudgetList(month)} className="mb-4">
        {loading ? 'Loading...' : <RefreshCcw /> }
      </Button>
      
      </div>
      
      {chartData1.length > 0 ? (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={chartData1}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
                >
                 
                </Pie>
              
              <Tooltip />
             
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full flex items-center justify-center">
          <p className="text-gray-500">
            {loading ? 'Loading chart data...' : 'No budget data available for this month'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PieChartRender
"use client"
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { eq, sql } from 'drizzle-orm'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BudgetTrendsChart({ month }) {
  const [isLoading, setIsLoading] = useState(true)
  const [monthsToFetch, setMonthsToFetch] = useState([])
  const [budgetData, setBudgetData] = useState([])
  const [chartData, setChartData] = useState([])
  const [categories, setCategories] = useState([])
  const { user } = useUser()

  // Colors for the chart lines
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  
  // Month names for x-axis labels
  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  // Step 1: Calculate which months to fetch (up to 6 months prior to the current month)
  useEffect(() => {
    if (!month) return
    
    const months = []
    const monthNumber = parseInt(month, 10)
    
    // Calculate the last 6 months (or fewer if month is less than 6)
    const startMonth = Math.max(1, monthNumber - 5)
    for (let i = startMonth; i <= monthNumber; i++) {
      months.push(i)
    }
    
    setMonthsToFetch(months)
  }, [month])

  // Step 2: Fetch budget data for all calculated months
  useEffect(() => {
    const fetchData = async () => {
      if (!user || monthsToFetch.length === 0) return
      
      setIsLoading(true)
      
      try {
        // Get all unique budget categories first
        const allCategories = await db
          .selectDistinct({ name: Budgets.name })
          .from(Budgets)
          .where(eq(Budgets.createdBy, user.id))
        
        const uniqueCategories = allCategories.map(cat => cat.name)
        setCategories(uniqueCategories)
        
        // Fetch data for each month
        const dataByMonth = []
        for (const monthNum of monthsToFetch) {
          //console.log(`Fetching data for month ${monthNum}`)
          const result = await db
            .select({
              name: Budgets.name,
              amount: Budgets.amount,
              totalSpend: sql`COALESCE(SUM(${Expenses.amount}::numeric), 0)`.mapWith(Number)
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Expenses.budgetId, Budgets.id))
            .where(eq(Budgets.createdBy, user.id))
            .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt}::date) = ${monthNum}`)
            .groupBy(Budgets.id, Budgets.name, Budgets.amount)
          
          // Store the result with the month number
          dataByMonth.push({
            month: monthNum,
            data: result
          })
          
          //console.log(`Month ${monthNum} data:`, result)
        }
        
        setBudgetData(dataByMonth)
      } catch (error) {
        console.error("Error fetching budget data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [monthsToFetch, user])

  // Step 3: Process the data for the chart
  useEffect(() => {
    if (budgetData.length === 0 || categories.length === 0) return
    
    // Format data for the LineChart component
    const formattedData = monthsToFetch.map(monthNum => {
      const monthData = budgetData.find(m => m.month === monthNum)?.data || []
      
      // Create an object for this month with spending for each category
      const dataPoint = {
        // Convert month number to month name (monthNum is 1-based, array is 0-based)
        month: MONTH_NAMES[monthNum - 1],
      }
      
      // Initialize all categories with 0
      categories.forEach(category => {
        dataPoint[category] = 0
      })
      
      // Update with actual values
      monthData.forEach(budget => {
        dataPoint[budget.name] = budget.totalSpend
      })
      
      return dataPoint
    })
    
    //console.log("Formatted chart data:", formattedData)
    setChartData(formattedData)
  }, [budgetData, categories, monthsToFetch])

  // Render loading state or chart
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md border">
      <h2 className="text-xl font-bold mb-4">Budget Spending Trends</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading budget data...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No budget data available for the selected months</p>
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  name={category}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default BudgetTrendsChart
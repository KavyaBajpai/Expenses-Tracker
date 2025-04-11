"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { sql, eq } from "drizzle-orm";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";


function OverspendingAnalysis({ month }) {
    const { user } = useUser();
    const prev1Month = month - 1 > 0 ? month - 1 : null;
    const prev2Month = month - 2 > 0 ? month - 2 : null;

    const [overspendingData, setOverspendingData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        const fetchOverspendingData = async () => {
            if (!user) return;

            setIsLoading(true);

            try {
                let overspendingResults = []; // Create an array to store the fetched data

                for (const prevMonth of [prev1Month, prev2Month]) {
                    if (!prevMonth) continue; // Skip if the month is invalid

                    console.log(`Fetching overspending data for month ${prevMonth}`);

                    const result = await db
                        .select({
                            name: Budgets.name,
                            totalBudget: sql`${Budgets.amount}::numeric`.mapWith(Number),
                            totalSpent: sql`COALESCE(SUM(${Expenses.amount}::numeric), 0)`.mapWith(Number),
                        })
                        .from(Budgets)
                        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                        .where(eq(Budgets.createdBy, user.id))
                        .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${prevMonth}`)
                        .groupBy(Budgets.id, Budgets.name, Budgets.amount);

                    console.log(`Database response for month ${prevMonth}:`, result);

                    // Process and store results
                    if (result.length > 0) {
                        overspendingResults.push({
                            month: prevMonth,
                            totalBudget: result.reduce((sum, item) => sum + item.totalBudget, 0),
                            totalSpent: result.reduce((sum, item) => sum + item.totalSpent, 0),
                            overspending: Math.max(0, result.reduce((sum, item) => sum + (item.totalSpent - item.totalBudget), 0)),
                            overspendingPercentage: Math.round(
                                (result.reduce((sum, item) => sum + item.totalSpent, 0) /
                                    result.reduce((sum, item) => sum + item.totalBudget, 0)) * 100
                            ),
                            status: result.some(item => item.totalSpent > item.totalBudget) ? "Overspent" : "Within Budget",
                        });
                    }
                    setOverspendingData(overspendingResults);

                }

            } catch (error) {
                console.error("Error fetching overspending data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverspendingData();
    }, [user, month]
    )

    return (
        <div className="bg-gray-100 rounded-lg p-5 border flex flex-col gap-8">
            <h2 className="font-bold text-xl mb-10">Overspending Analysis</h2>

            {/* Debugging Logs */}
            {console.log("overspendingData:", overspendingData)}

            {overspendingData.length === 0 ? (
                <p className="text-center text-gray-500">No data available</p>
            ) : (
                <div className="flex justify-center items-center h-80 mb-4">
                    <Carousel className="w-full max-w-xs bg-gray-900">
                        <CarouselContent className="bg-gray-900 text-gray-100 border-none">
                            {overspendingData.map((data, index) => (
                                <CarouselItem key={index} className="bg-gray-900 text-gray-100 border-none">
                                    <Card className="bg-gray-900 text-gray-100 border-none">
                                        <CardContent className="flex flex-col items-center justify-center p-6">
                                            <p className="text-lg font-semibold">{`Month ${data.month}`}</p>
                                            <span className="text-2xl font-semibold">{data.overspending > 0 ? `-${data.overspending}` : "No Overspending"}</span>
                                            <span className="text-lg font-medium mt-6">Total Budget: {data.totalBudget}</span>
                                            <span className="text-lg font-medium">Total Spend: {data.totalSpent}</span>
                                            <div className="mt-4 flex items-center gap-2">
                                                {data.status === "High Overspending" }
                                                {data.status === "Mild Overspending" }
                                                {data.status === "On Budget" }
                                                <p className="text-xl">{data.status}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
        </div>
    );
}

export default OverspendingAnalysis;


//     const fetchOverspendingData = async (prevMonth) => {

        //       if (!prevMonth) return null; // Prevent errors for invalid months

        //       try {
        //         const result = await db
        //           .select({
        //             name: Budgets.name,
        //             totalBudget: sql`${Budgets.amount}::numeric`.mapWith(Number),
        //             totalSpent: sql`COALESCE(SUM(${Expenses.amount}::numeric), 0)`.mapWith(Number),
        //           })
        //           .from(Budgets)
        //           .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        //           .where(eq(Budgets.createdBy, user.id))
        //           .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${prevMonth}`)
        //           .groupBy(Budgets.id, Budgets.name, Budgets.amount);

        //         const totalBudget = result.reduce((sum, item) => sum + item.totalBudget, 0);
        //         const totalSpent = result.reduce((sum, item) => sum + item.totalSpent, 0);
        //         const overspending = Math.max(0, totalSpent - totalBudget);
        //         const overspendingPercentage = totalBudget > 0 ? ((overspending / totalBudget) * 100).toFixed(1) : 0;
        //         const status = overspendingPercentage > 10 ? "High Overspending" : overspendingPercentage > 0 ? "Mild Overspending" : "On Budget";

        //         return { month: prevMonth, totalBudget, totalSpent, overspending, overspendingPercentage, status };
        //       } catch (error) {
        //         console.error("Error fetching overspending data:", error);
        //         return null;
        //       }
        //     };

        //     // Fetch data for both months at the same time
        //     Promise.all([fetchOverspendingData(prev1Month), fetchOverspendingData(prev2Month)]).then((data) => {
        //       setOverspendingData(data.filter((item) => item)); // Remove null values
        //     });
        //   }, [month, user]);
"use server";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";  
import { eq, sql } from "drizzle-orm";  
import { currentUser } from "@clerk/nextjs/server"; 
export const getBudgetList = async () => {  
    const user = await currentUser(); 
    if (!user || !user.id) return []; 
    const currentMonth = new Date().getMonth() + 1;  

    const budgets = await db.select({  
        id: Budgets.id,  
        name: Budgets.name,  
    }).from(Budgets)  
    .where(eq(Budgets.createdBy, user.id))  
    .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${currentMonth}`)  
    .groupBy(Budgets.id);  

    console.log("Fetched Budgets:", budgets); 
    return budgets;
};

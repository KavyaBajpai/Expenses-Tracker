"use server";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";  
import { eq, sql } from "drizzle-orm";  
import { currentUser } from "@clerk/nextjs/server"; // ✅ No need for `auth()`

export const getBudgetList = async () => {  
    const user = await currentUser(); // ✅ Fix: `currentUser()` returns an object with `id`
    if (!user || !user.id) return [];  // ✅ Check for a valid user

    const currentMonth = new Date().getMonth() + 1;  

    const budgets = await db.select({  
        id: Budgets.id,  
        name: Budgets.name,  
    }).from(Budgets)  
    .where(eq(Budgets.createdBy, user.id))  // ✅ Fix: Use `user.id`
    .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${currentMonth}`)  
    .groupBy(Budgets.id);  

    console.log("Fetched Budgets:", budgets); // ✅ Debugging log
    return budgets;
};

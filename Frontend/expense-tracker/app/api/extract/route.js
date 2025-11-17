import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getBudgetList } from "@/app/server/action"; // Import server action

export async function POST(req) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }
    console.log("hi from route.js")
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Get the list of existing budget categories
    const budgetList = await getBudgetList();
    const categoryList = budgetList.map(b => b.name).join(", ");
    const budgetMapping = Object.fromEntries(budgetList.map(b => [b.name, b.id]));
    console.log(budgetList)
    // Initialize Gemini AI client
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          parts: [
            {
              text: `Extract the list of purchased items and their amounts from this receipt image. 
                     Then categorize each item into one of the following categories: ${categoryList}. 
                     Ensure that the response includes the corresponding budget ID from this list. 
                     Return the result in JSON format as { "items": [{ "name": "string", "amount": number, "category": "string", "budgetId": "string" }] }.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    
    let cleanData = response.text.replace(/^```json\n|\n```$/g, "");
    let extractedData = JSON.parse(cleanData);

    extractedData.items = extractedData.items.map(item => ({
      ...item,
      budgetId: budgetMapping[item.category] || null,
    }));

    return NextResponse.json({ data: extractedData });

  } catch (error) {
    console.error("Error processing receipt:", error);
    console.error("Error processing receipt:", error.message);
    return NextResponse.json({
      error: "Failed to process the receipt",
      details: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

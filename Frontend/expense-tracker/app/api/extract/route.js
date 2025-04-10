import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Initialize client with API key
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // First, list available models to check which ones we can use
    // try {
    //   const models = await ai.models.list();
    //   console.log("Available models:", models);
    // } catch (listError) {
    //   console.log("Unable to list models:", listError);
    // }

    // Use the correct model identifier for vision capabilities
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Try using this model instead
      contents: [
        {
          parts: [
            {
              text: "Extract the list of purchased items and their amounts from this receipt image. " +
                    "Then categorize each item into one of the following: Groceries, Food, Clothing, Stationery, Electronics, or Miscellaneous. " +
                    "Return the result in JSON format as { items: [{ name, amount, category }] }."
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ]
    });

    return NextResponse.json({ data: response.text });

  } catch (error) {
    console.error("Error processing receipt:", error);
    return NextResponse.json({ 
      error: "Failed to process the receipt", 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
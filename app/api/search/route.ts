import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { inventory } from "@/lib/inventory";
import { AISearchResponseSchema } from "@/lib/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyCbhgpHiOZs50MIKjA-sCPP7EgX3QopoeQ");

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const systemPrompt = `
      You are a Smart Travel Scout. Your task is to help users find the best-matching travel experiences from the provided inventory.
      
      STRICT RULES:
      1. You must ONLY suggest items from the provided inventory below.
      2. If no items match, return an empty "matches" array and explain why in the "explanation" field.
      3. For each match, provide a brief reasoning why it matches the user's intent (tags, location, price).
      4. Do NOT hallucinate or suggest destinations outside the list.
      5. Output MUST be valid JSON matching this schema:
         {
           "matches": [{ "id": number, "reasoning": string, "confidence": number }],
           "explanation": string
         }

      INVENTORY:
      ${JSON.stringify(inventory, null, 2)}
    `;

        const prompt = `User request: "${query}"`;

        const result = await model.generateContent([systemPrompt, prompt]);
        const responseText = result.response.text();

        // Parse and validate with Zod
        const parsedData = JSON.parse(responseText);
        const validatedData = AISearchResponseSchema.parse(parsedData);

        // Final Post-Processing Safety Check: Ensure IDs actually exist in inventory
        const finalMatches = validatedData.matches.filter(match =>
            inventory.some(item => item.id === match.id)
        ).map(match => ({
            ...match,
            item: inventory.find(item => item.id === match.id)!
        }));

        return NextResponse.json({
            matches: finalMatches,
            explanation: validatedData.explanation
        });

    } catch (error: any) {
        console.error("AI Search Error:", error);
        return NextResponse.json(
            { error: "Failed to process search request", details: error.message },
            { status: 500 }
        );
    }
}

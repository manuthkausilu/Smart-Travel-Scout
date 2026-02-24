import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AISearchResponseSchema } from "@/lib/schema";
import { inventory, TravelItem } from "@/lib/inventory";
import { vectorStore } from "@/lib/vector-store";
import { isRateLimited } from "@/lib/rate-limit";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

//check if apiKey is defined
if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        // --- Rate Limiting Step ---
        // Robust IP detection for Vercel/proxies
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = (req as any).ip ||
            (forwarded ? forwarded.split(",")[0].trim() : null) ||
            req.headers.get("x-real-ip") ||
            "127.0.0.1";

        const { limited, retryAfter } = isRateLimited(ip);

        if (limited) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later.", retryAfter },
                { status: 429 }
            );
        }

        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        // --- Hybrid Retrieval Step ---
        // Retrieve top 3 candidates from the inventory using vector search
        const candidates = await vectorStore.search(query, 3);

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const systemPrompt = `
      You are a Smart Travel Scout. Your task is to help users find the best-matching travel experiences from the provided candidates.
      
      STRICT RULES:
      1. You must ONLY suggest items from the provided candidates below.
      2. If no items match, return an empty "matches" array and explain why in the "explanation" field.
      3. For each match, provide a brief reasoning why it matches the user's intent (tags, location, price).
      4. Do NOT hallucinate or suggest destinations outside the list.
      5. Output MUST be valid JSON matching this schema:
         {
           "matches": [{ "id": number, "reasoning": string, "confidence": number }],
           "explanation": string
         }

      CANDIDATES:
      ${JSON.stringify(candidates, null, 2)}
    `;

        const prompt = `User request: "${query}"`;

        console.log("--- GEMINI PAYLOAD ---");
        console.log("System Prompt:", systemPrompt);
        console.log("User Prompt:", prompt);
        console.log("----------------------");

        const result = await model.generateContent([systemPrompt, prompt]);
        let responseText = result.response.text();

        // Clean up response text (remove markdown formatting if present)
        responseText = responseText.replace(/```json\n?|```/g, "").trim();

        console.log("--- GEMINI RESPONSE ---");
        console.log(responseText);
        console.log("------------------------");

        // Parse and validate with Zod
        const parsedData = JSON.parse(responseText);
        const validatedData = AISearchResponseSchema.parse(parsedData);

        // Final Post-Processing Safety Check: Ensure IDs actually exist in candidates (or full inventory)
        const finalMatches = validatedData.matches.filter((match: any) =>
            candidates.some((item: TravelItem) => item.id === match.id)
        ).map((match: any) => ({
            ...match,
            item: candidates.find((item: TravelItem) => item.id === match.id)!
        }));

        return NextResponse.json({
            matches: finalMatches,
            explanation: validatedData.explanation
        });

    } catch (error: any) {
        console.error("AI Search Error:", error);

        // Special handling for Gemini API Rate Limits / Quota
        const errorMessage = error.message || "";
        const isQuotaExceeded =
            error.status === 429 ||
            errorMessage.includes("429") ||
            errorMessage.toLowerCase().includes("quota");

        if (isQuotaExceeded) {
            return NextResponse.json(
                { error: "The AI service is currently busy (quota exceeded). Please wait a moment and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to process search request", details: error.message },
            { status: 500 }
        );
    }
}

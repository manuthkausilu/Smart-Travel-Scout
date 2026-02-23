import { z } from "zod";

export const AISearchResponseSchema = z.object({
    matches: z.array(
        z.object({
            id: z.number().describe("The ID of the matched travel item from the inventory"),
            reasoning: z.string().describe("A brief explanation of why this item matches the user's request"),
            confidence: z.number().min(0).max(1).describe("Confidence score of the match"),
        })
    ),
    explanation: z.string().describe("A summary of why these items were selected or why no matches were found"),
});

export type AISearchResponse = z.infer<typeof AISearchResponseSchema>;

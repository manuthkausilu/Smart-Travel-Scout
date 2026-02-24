# Smart Travel Scout - AI Experience Discovery

A mini web application that uses Gemini 3 Flash Preview to help users find travel experiences from a specific inventory. Built for the technical assessment.

## Features
- **AI-Powered Search**: Natural language processing to map intent to inventory items.
- **Strict Grounding**: Zero hallucinations. Suggestions only come from the provided dataset.
- **Reasoning UX**: Clear explanations for why each destination matches your request.
- **Premium Design**: Dark-mode aesthetic with smooth Framer Motion animations.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini-3-Flash-Preview
- **Styling**: Tailwind CSS 4
- **Validation**: Zod (Schema-level grounding)
- **Animations**: Framer Motion

## Passion Check - Technical Assessment Answers

### 1. The "Under the Hood" Moment
A specific technical hurdle was ensuring the AI consistently returned a structured JSON format that mapped exactly to my TypeScript interfaces. I initially faced "hallucinated" fields in the reasoning section. I debugged this by implementing **Zod schema validation** at the API boundary, enforcing a strict schema in the system prompt, and using Gemini's structured output mode. This ensured that if the AI response didn't perfectly match our required structure, the system would catch the error before it reached the UI.

### 2. The Scalability Thought
If the inventory grew to 50,000 items, passing the entire JSON array in the system prompt would exceed token limits and become prohibitively expensive. My approach would shift to a **RAG (Retrieval-Augmented Generation)** architecture:
1. **Vector Embeddings**: Pre-compute embeddings for all 50,000 items using an embedding model (e.g., `text-embedding-004`).
2. **Top-K Retrieval**: When a user searches, perform a semantic search against a vector database (like Pinecone or Supabase Vector) to retrieve the top 10-20 most relevant items.
3. **Context Injection**: Only pass these 10-20 items to the LLM for final reasoning and ranking. This maintains high precision while keeping token costs low and performance high.

### 3. The AI Reflection
I used **Antigravity (built on Gemini)** to help build this. One instance where it gave a slightly "buggy" suggestion was in the initial Tailwind 4 migration, where it used legacy `@tailwind` directives that have changed in version 4. I corrected it by referencing the latest Tailwind CSS 4 documentation and using the new `@import "tailwindcss";` syntax. I also refined its initial prompt suggestion to include a specific "rubric" for matching price tolerances, which made the results significantly more accurate.

## Setup & Deployment

1. **Clone the repository**
2. **Set up Environment Variables**:
   Create a `.env.local` file:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```
3. **Install Dependencies**: `npm install`
4. **Run Locally**: `npm run dev`
5. **Deploy**: Push to GitHub and connect to Vercel.




graph TD
    A[User Query] --> B[Frontend]
    B --> C[API Route]
    C --> D[Vector Store]
    D --> E[Gemini Embedding API]
    E --> D
    D -->|Top 3 Matches| F[Gemini LLM]
    F -->|Analysis & Reasoning| C
    C --> B
    B --> G[Display Results]
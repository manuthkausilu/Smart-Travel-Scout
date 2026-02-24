import { inventory, TravelItem } from "./inventory";
import { generateEmbedding, cosineSimilarity } from "./embeddings";

interface EmbeddedItem extends TravelItem {
    embedding: number[];
}

class VectorStore {
    private items: EmbeddedItem[] = [];
    private isInitialized = false;

    async initialize() {
        if (this.isInitialized) return;

        console.log("Initializing Vector Store...");
        const itemsWithEmbeddings = await Promise.all(
            inventory.map(async (item) => {
                const text = `${item.title} ${item.location} ${item.tags.join(" ")}`;
                const embedding = await generateEmbedding(text);
                return { ...item, embedding };
            })
        );

        this.items = itemsWithEmbeddings;
        this.isInitialized = true;
        console.log("Vector Store initialized.");
    }

    async search(query: string, k: number = 3): Promise<TravelItem[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const queryEmbedding = await generateEmbedding(query);

        const scoredItems = this.items.map(item => ({
            item,
            score: cosineSimilarity(queryEmbedding, item.embedding)
        }));

        // Sort by score descending and take top k
        return scoredItems
            .sort((a, b) => b.score - a.score)
            .slice(0, k)
            .map(s => {
                // Remove embedding from returned object to match TravelItem interface
                const { embedding, ...rest } = s.item;
                return rest;
            });
    }
}

// Export a singleton instance
export const vectorStore = new VectorStore();

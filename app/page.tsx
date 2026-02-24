"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";
import { TravelItem } from "@/lib/inventory";

// Import Refactored Components
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";

interface Match {
  id: number;
  reasoning: string;
  confidence: number;
  item: TravelItem;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Match[]>([]);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setExplanation("");

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.matches);
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[var(--foreground)]">
      <Navbar />
      <br></br>

      <div className="p-6 md:p-12 max-w-7xl mx-auto pt-24">
        {/* Branding & Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 pt-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
            Discover your next <br className="hidden md:block" />
            <span className="text-[#e31c23]">extraordinary</span> adventure
          </h1>
        </motion.div>

        <SearchBar
          query={query}
          setQuery={setQuery}
          loading={loading}
          onSearch={handleSearch}
        />

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium max-w-xl mx-auto"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Hero show={!query && results.length === 0} />

        {/* Results Section */}
        <section className="max-w-6xl mx-auto">
          {results.length > 0 && (
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended for you
              </h2>
              <span className="text-sm font-semibold text-gray-500">
                {results.length} results found
              </span>
            </div>
          )}

          {explanation && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border border-gray-100 p-8 rounded-[32px] text-gray-700 mb-12 relative overflow-hidden text-center"
            >
              <p className="relative z-10 font-medium italic leading-relaxed text-lg text-gray-800">
                &ldquo;{explanation}&rdquo;
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            <AnimatePresence mode="popLayout">
              {results.map((match, index) => (
                <ResultCard key={match.id} match={match} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {!loading && results.length === 0 && query && !error && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                <Compass className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No results found. Try adjusting your search.</p>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
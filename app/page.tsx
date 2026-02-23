"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Tag, CircleDollarSign, Compass, Loader2, Sparkles } from "lucide-react";
import { TravelItem } from "@/lib/inventory";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(data.matches);
      setExplanation(data.explanation);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Discovery</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-primary via-accent to-white bg-clip-text text-transparent">
          Smart Travel Scout
        </h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Describe your perfect trip—from surfing vibes to mountain peaks—and our AI will find the best match from our exclusive inventory.
        </p>
      </motion.div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. a chilled beach weekend with surfing vibes under $100"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-5 px-6 pl-14 text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500 glass"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
        <button
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Discover"}
        </button>
      </form>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            {loading ? "Scouting destinations..." : results.length > 0 ? "Top Matches" : "Ready for your prompt"}
          </h2>
          {results.length > 0 && (
            <span className="text-sm text-secondary">
              Found {results.length} results
            </span>
          )}
        </div>

        {explanation && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/30 p-4 rounded-xl text-secondary mb-8 border border-slate-700/50 italic"
          >
            &ldquo;{explanation}&rdquo;
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {results.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-primary/50 transition-all glass"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {match.item.title}
                  </h3>
                  <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-lg text-xs font-bold ring-1 ring-primary/30">
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    ${match.item.price}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-secondary text-sm mb-4">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  {match.item.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {match.item.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-slate-900/50 text-slate-400 px-2 py-1 rounded-md text-xs border border-slate-700/50 uppercase tracking-wider">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border-l-4 border-primary/50">
                  <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Why it matches
                  </h4>
                  <p className="text-secondary text-sm leading-relaxed">
                    {match.reasoning}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!loading && results.length === 0 && query && !error && (
          <div className="text-center py-20 opacity-50">
            <Compass className="w-16 h-16 mx-auto mb-4 text-slate-700 animate-pulse" />
            <p className="text-slate-500">No exact matches found in our local inventory. Try another request!</p>
          </div>
        )}
      </section>
    </main>
  );
}

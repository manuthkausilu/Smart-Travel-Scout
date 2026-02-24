"use client";

import React from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
    query: string;
    setQuery: (val: string) => void;
    loading: boolean;
    onSearch: (e: React.FormEvent) => void;
}

export function SearchBar({ query, setQuery, loading, onSearch }: SearchBarProps) {
    return (
        <form onSubmit={onSearch} className="relative z-20 mb-16 max-w-4xl mx-auto">
            <div className="pill-shadow bg-white rounded-full border border-gray-200 flex items-center p-2 transition-all hover:border-gray-300">
                <div className="flex-[2] flex items-center px-6 border-r border-gray-200">
                    <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="eg : a chilled beach weekend with surfing vibes under $100..."
                        className="w-full bg-transparent border-none py-3 text-gray-900 focus:outline-none placeholder:text-gray-400 text-sm font-medium"
                    />
                </div>

                <button
                    disabled={loading}
                    className="bg-[#e31c23] hover:bg-[#c9181e] text-white font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm ml-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Search</span>
                            <Search className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

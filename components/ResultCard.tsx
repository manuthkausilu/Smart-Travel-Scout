"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, CircleDollarSign, Sparkles } from "lucide-react";
import { TravelItem } from "@/lib/inventory";

interface Match {
    id: number;
    reasoning: string;
    confidence: number;
    item: TravelItem;
}

interface ResultCardProps {
    match: Match;
    index: number;
}

export function ResultCard({ match, index }: ResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="group flex flex-col bg-white border border-gray-100 rounded-[24px] overflow-hidden transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
        >
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <MapPin className="w-3.5 h-3.5 text-[#e31c23]" />
                        {match.item.location}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 text-gray-900 px-3 py-1 rounded-xl text-xs font-bold border border-gray-100">
                        <CircleDollarSign className="w-4 h-4 text-[#e31c23]" />
                        {match.item.price}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#e31c23] transition-colors mb-4 line-clamp-1">
                    {match.item.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                    {match.item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-stone-500 text-[10px] font-black uppercase tracking-wider">
                            • {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto p-6 rounded-2xl bg-[#e31c23]/5 border border-[#e31c23]/10">
                    <h4 className="text-[10px] font-black text-[#e31c23] mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Match Insight
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {match.reasoning}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

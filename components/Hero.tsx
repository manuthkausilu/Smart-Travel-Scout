"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
    show: boolean;
}

export function Hero({ show }: HeroProps) {
    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden mb-12 shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/20 to-transparent z-10" />
            <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000"
                alt="General Travel Adventure"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-[2px] bg-red-500" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-red-500">New Expedition</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black mb-8 italic tracking-tighter leading-tight">Adventure</h2>
                <button className="bg-[#e31c23] hover:bg-white hover:text-gray-900 text-white font-bold px-10 py-4 rounded-full transition-all flex items-center gap-3 shadow-lg shadow-red-500/20 active:scale-95 group">
                    <span>Explore destinations</span>
                </button>
            </div>
        </motion.div>
    );
}

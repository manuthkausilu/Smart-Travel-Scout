"use client";

import React from "react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white z-50">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/travel-ai.webp" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-lg font-black tracking-tight uppercase italic text-gray-900">
                        Smart Travel <span className="text-gray-400">Scout</span>
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span className="hover:text-[#e31c23] cursor-pointer transition-colors">Destinations</span>
                    <span className="hover:text-[#e31c23] cursor-pointer transition-colors">Expeditions</span>
                </div>
            </div>
        </nav>
    );
}

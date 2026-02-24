"use client";

import React from "react";

export function Footer() {
    return (
        <footer className="mt-20 py-12 max-w-6xl mx-auto text-center bg-white">
            <div className="flex items-center justify-center gap-2 mb-6">
                <img src="/travel-ai.webp" alt="Logo" className="w-6 h-6 rounded-lg opacity-150 grayscale" />
                <span className="text-2xl font-black uppercase tracking-widest text-gray-400">Smart Travel Scout</span>
            </div>
            <p className="text-gray-400 text-[12px] font-medium tracking-wide">
                &copy; 2026 Smart Travel Scout. All rights reserved. <br />
                Develop by Manuth Kausilu.
            </p>
        </footer>
    );
}

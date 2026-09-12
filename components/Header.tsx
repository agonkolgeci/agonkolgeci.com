"use client";

import { useEffect, useState } from 'react';
import Navbar from './navigation/navbar/Navbar';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 w-full h-[72px] flex items-center transition-colors duration-300 border-b ${scrolled ? 'bg-[#030303]/95 border-white/5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent'}`}>
            <div className="max-w-7xl mx-auto w-full h-full px-6 md:px-12 flex items-center justify-between">
                <Navbar />
            </div>
        </header>
    );
}
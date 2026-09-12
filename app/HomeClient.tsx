"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import SocialsLinks from "@/components/navigation/socials/SocialsLinks";


import useVisibleAnimation from "@/components/utils/hooks/useVisibleAnimation";
import SkillsClient from "./skills/SkillsClient";
import EducationClient from "./education/EducationClient";
import SoftSkillsClient from "./skills/SoftSkillsClient";
import ExperiencesClient from "./experiences/ExperiencesClient";
import GalleryClient from "./gallery/GalleryClient";
import ContactClient from "./contact/ContactClient";


// Key technologies surfaced under the About bio
const ABOUT_TECH = ["TypeScript", "React", "Next.js", "Node", "Tailwind"];

// Creative footer under the bio text: quick facts + tech stack + connect
const AboutExtras = () => {
    return (
        <div className="flex flex-col gap-6">
            {/* Quick facts */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[11px] font-secondary font-bold text-gray-300 bg-white/[0.03] border border-white/8 rounded-full px-3.5 py-1.5">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-xs" />
                    Geneva, CH
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] font-secondary font-bold text-gray-300 bg-white/[0.03] border border-white/8 rounded-full px-3.5 py-1.5">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400 text-xs" />
                    MSc Computer Science
                </span>
            </div>

            {/* Connect */}
            <div className="flex flex-row items-center gap-4 pt-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-extrabold select-none">Connect</span>
                <SocialsLinks className="flex flex-row gap-6 text-lg text-gray-400 hover:text-white transition-colors" />
            </div>
        </div>
    );
};

// Mobile / tablet About — simple stacked layout (no scroll-jacking)
const AboutMobile = () => {
    const t = useTranslations("home");
    const sentences = t("about.presentation").match(/[^.!?]+[.!?]+/g) ?? [t("about.presentation")];
    const intro = sentences.slice(0, 2).join(" ").trim();

    return (
        <div className="relative w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24 flex flex-col gap-10 sm:gap-12">
                <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-[28px] overflow-hidden border border-white/8 transform-gpu">
                    <Image 
                        src="/home/portrait.png" 
                        fill 
                        sizes="(max-width: 1024px) 100vw, 50vw" 
                        alt={t("about.title")} 
                        className="object-cover object-center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight break-words [text-wrap:balance]">
                        {t("about.title")}
                    </h2>
                    <p className="font-secondary text-sm sm:text-base text-gray-300 leading-relaxed break-words [text-wrap:pretty]">
                        {intro}
                    </p>
                    <AboutExtras />
                </div>
            </div>
        </div>
    );
};

// Desktop About — pinned; portrait starts full then smoothly reveals right side on GPU while text slides in.
const AboutDesktop = () => {
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Image starts full-screen and clips GPU-side to the right 50% as text slides in (no DOM layout reflow)
    const imageClip = useTransform(
        scrollYProgress,
        [0, 0.38, 1],
        ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 48%)", "inset(0% 0% 0% 48%)"]
    );
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

    // Text panel slides in from the left and reaches 100% full opacity early in the scroll
    const textOpacity = useTransform(scrollYProgress, [0.06, 0.28], [0, 1]);
    const textX = useTransform(scrollYProgress, [0.06, 0.28], [-35, 0]);

    const sentences = t("about.presentation").match(/[^.!?]+[.!?]+/g) ?? [t("about.presentation")];
    const intro = sentences.slice(0, 2).join(" ").trim();

    return (
        <div ref={sectionRef} className="relative h-[180vh] w-full bg-transparent">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">

                {/* Image: GPU-accelerated clipPath animation completely avoids CPU layout reflows */}
                <motion.div
                    style={{ clipPath: imageClip }}
                    className="absolute right-0 top-0 h-full w-full overflow-hidden z-0 pointer-events-none transform-gpu will-change-transform"
                >
                    <motion.div style={{ scale: imageScale }} className="absolute right-0 top-0 h-full w-full">
                        <Image
                            src="/home/portrait.png"
                            fill
                            sizes="100vw"
                            priority
                            alt={t("about.title")}
                            className="object-cover object-[center_right] xl:object-center"
                        />
                    </motion.div>
                    {/* Left-edge gradient smoothly blends the photo into the dark background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent pointer-events-none" />
                </motion.div>

                {/* Text panel: slightly widened container with generous padding and crisp line breaks */}
                <motion.div
                    style={{ opacity: textOpacity, x: textX }}
                    className="relative z-10 w-full lg:w-[54%] xl:w-[50%] h-full flex flex-col justify-center gap-7 pl-8 sm:pl-12 lg:pl-16 xl:pl-24 pr-6 sm:pr-8 lg:pr-12 xl:pr-14 select-none transform-gpu will-change-transform"
                >
                    <h2 className="font-primary text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.05] break-words [text-wrap:balance]">
                        {t("about.title")}
                    </h2>
                    <p className="font-secondary text-sm lg:text-base xl:text-lg text-gray-300 leading-relaxed max-w-xl break-words [text-wrap:pretty]">
                        {intro}
                    </p>
                    <AboutExtras />
                </motion.div>

            </div>
        </div>
    );
};

// About dispatcher — pinned expand on desktop, stacked on mobile.
const AboutScrollSection = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return isDesktop ? <AboutDesktop /> : <AboutMobile />;
};


// Client-side module-level memory state to bypass preloader on client-side routing
let preloaderHasPlayed = false;

export default function HomeClient() {
    const t = useTranslations("home");
    const { ref: heroRef, active: heroActive } = useVisibleAnimation();
    const [showPreloader, setShowPreloader] = useState(() => !preloaderHasPlayed);
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);

    useEffect(() => {
        if (preloaderHasPlayed) return;

        const timer = setTimeout(() => {
            setShowPreloader(false);
            preloaderHasPlayed = true;
        }, 1500); // 1.5s homepage entry preloader on absolute first landing
        return () => clearTimeout(timer);
    }, []);

    // Lock the page while the preloader is visible so wheel/touch input cannot
    // advance the homepage before the entry animation finishes.
    useEffect(() => {
        if (!showPreloader) return;

        const scrollY = window.scrollY;
        const { body, documentElement } = document;
        const previousBodyStyle = {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overscrollBehavior: body.style.overscrollBehavior
        };
        const previousHtmlStyle = {
            overflow: documentElement.style.overflow,
            overscrollBehavior: documentElement.style.overscrollBehavior
        };

        documentElement.style.overflow = "hidden";
        documentElement.style.overscrollBehavior = "none";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overscrollBehavior = "none";

        return () => {
            documentElement.style.overflow = previousHtmlStyle.overflow;
            documentElement.style.overscrollBehavior = previousHtmlStyle.overscrollBehavior;
            body.style.overflow = previousBodyStyle.overflow;
            body.style.position = previousBodyStyle.position;
            body.style.top = previousBodyStyle.top;
            body.style.width = previousBodyStyle.width;
            body.style.overscrollBehavior = previousBodyStyle.overscrollBehavior;
            window.scrollTo(0, scrollY);
        };
    }, [showPreloader]);

    // Smooth scroll to hash anchor on mount once the preloader fades out
    useEffect(() => {
        if (!showPreloader && typeof window !== "undefined" && window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [showPreloader]);

    const nameText = t("title");
    const descText = t("description");

    return (
        <div className="w-full bg-transparent relative overflow-visible">
            
            {/* Preloader Overlay (ciaoenergy.com inspired) */}
            <AnimatePresence>
                {showPreloader && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ 
                            opacity: 0, 
                            scale: 1.01,
                            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } 
                        }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none touch-none"
                    >
                        {/* Centered Massive Masked Logo System */}
                        <div className="relative w-[360px] sm:w-[560px] md:w-[720px] lg:w-[840px] h-[110px] sm:h-[160px] md:h-[200px] lg:h-[240px] flex items-center justify-center">
                            
                            {/* Layer 1: Dark Gray Silhouette Background */}
                            <div 
                                className="absolute inset-0 bg-[#1a1a1a]"
                                style={{
                                    WebkitMaskImage: 'url(/logo.png)',
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskImage: 'url(/logo.png)',
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center'
                                }}
                            />

                            {/* Layer 2: Glowing Liquid Sweep (Runs infinitely bottom to top once the mask image is fully loaded) */}
                            <div 
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    WebkitMaskImage: 'url(/logo.png)',
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskImage: 'url(/logo.png)',
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center'
                                }}
                            >
                                {isLogoLoaded && (
                                    <motion.div 
                                        initial={{ y: "115%" }}
                                        animate={{ y: "-115%" }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "linear",
                                            repeat: Infinity
                                        }}
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(to top, transparent 0%, rgba(255, 255, 255, 0.95) 50%, transparent 100%)',
                                        }}
                                    />
                                )}
                            </div>

                            {/* Invisible Next.js image layer to preload and guarantee onLoad state triggers perfectly */}
                            <Image 
                                src="/logo.png" 
                                alt="Preloader Logo Hook"
                                width={1}
                                height={1}
                                className="opacity-0 absolute pointer-events-none"
                                priority
                                onLoad={() => setIsLogoLoaded(true)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* HERO SECTION */}
            <div ref={heroRef} data-animation-active={heroActive} id="home" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden scroll-mt-[var(--navbar-height)]">
                {/* Atmospheric grid lines with traveling neon glows */}
                <div className="absolute top-0 left-[20%] w-px h-full bg-white/4 pointer-events-none overflow-hidden">
                    <div
                        className="w-full h-24 bg-gradient-to-b from-transparent via-accent-blue to-transparent"
                        style={{ animation: "beam-travel-y 4s linear infinite" }}
                    />
                </div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/4 pointer-events-none overflow-hidden">
                    <div
                        className="w-full h-32 bg-gradient-to-b from-transparent via-accent-blue/60 to-transparent"
                        style={{ animation: "beam-travel-y 6.5s linear 1s infinite" }}
                    />
                </div>
                <div className="absolute top-0 right-[20%] w-px h-full bg-white/4 pointer-events-none overflow-hidden">
                    <div
                        className="w-full h-24 bg-gradient-to-b from-transparent via-accent-teal to-transparent"
                        style={{ animation: "beam-travel-y 4s linear 2s infinite" }}
                    />
                </div>
                <div className="absolute top-[30%] left-0 w-full h-px bg-white/4 pointer-events-none overflow-hidden">
                    <div
                        className="h-full w-40 bg-gradient-to-r from-transparent via-accent-teal/50 to-transparent"
                        style={{ animation: "beam-travel-x 7s linear 1.5s infinite" }}
                    />
                </div>
                <div className="absolute bottom-[30%] left-0 w-full h-px bg-white/4 pointer-events-none" />

                {/* Soft breathing background lighting */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[480px] h-[340px] md:h-[480px] bg-[radial-gradient(ellipse,rgba(78,168,255,0.10),transparent_70%)] pointer-events-none" />

                <div className="flex flex-col items-center justify-center gap-8 max-w-6xl px-6 text-center z-10 select-none">
                    
                    {/* Name — white first word + animated gradient last word */}
                    <div className="relative">
                        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                            <div className="w-[85%] h-[55%] bg-[radial-gradient(ellipse,rgba(78,168,255,0.12),transparent_70%)]" />
                        </div>

                        <h1 className="font-primary text-[clamp(3rem,13vw,9.5rem)] tracking-tighter font-extrabold leading-[0.9] flex flex-wrap justify-center gap-x-3 sm:gap-x-5">
                            {nameText.split(" ").map((word, wordIdx, arr) => {
                                const isLast = wordIdx === arr.length - 1;
                                return (
                                    <motion.span
                                        key={wordIdx}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={showPreloader ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
                                        transition={{ duration: 0.9, delay: 0.15 + wordIdx * 0.18, ease: [0.16, 1, 0.3, 1] }}
                                        className={isLast
                                            ? "inline-block text-gradient drop-shadow-[0_0_45px_rgba(121,157,255,0.35)]"
                                            : "inline-block text-white"}
                                    >
                                        {word}
                                    </motion.span>
                                );
                            })}
                        </h1>
                    </div>

                    {/* Role — framed by accent gradient lines */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={showPreloader ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-3 sm:gap-6"
                    >
                        <span className="h-px w-8 sm:w-16 md:w-20 bg-gradient-to-r from-transparent to-accent-blue/70" />
                        <p className="font-secondary text-xs sm:text-lg md:text-xl tracking-[0.2em] sm:tracking-[0.35em] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 whitespace-nowrap">
                            {descText}
                        </p>
                        <span className="h-px w-8 sm:w-16 md:w-20 bg-gradient-to-l from-transparent to-accent-teal/70" />
                    </motion.div>
                </div>

                {/* Subtle Scroll Down Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={showPreloader ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 select-none group"
                    onClick={() => {
                        const aboutEl = document.getElementById("about");
                        if (aboutEl) aboutEl.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-extrabold group-hover:text-white transition-colors duration-300">
                        {t("scroll_down")}
                    </span>
                    <div className="w-5 h-9 rounded-full border border-white/20 group-hover:border-accent-blue/50 flex justify-center p-1.5 bg-white/2 transition-colors duration-300">
                        <div
                            className="w-1 h-1 rounded-full bg-accent-blue"
                            style={{ animation: "scroll-hint 1.6s ease-in-out infinite" }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* VIEWPORT-LOCKING STORYTELLING ABOUT Me SECTION */}
            <div id="about" className="w-full">
                <AboutScrollSection />
            </div>

            {/* SKILLS SECTION */}
            <div id="skills" className="w-full scroll-mt-[var(--navbar-height)]">
                <SkillsClient />
            </div>

            {/* EDUCATION SECTION */}
            <div id="education" className="w-full scroll-mt-[var(--navbar-height)]">
                <EducationClient />
            </div>

            {/* SOFT SKILLS SECTION */}
            <div id="soft-skills" className="w-full scroll-mt-[var(--navbar-height)]">
                <SoftSkillsClient />
            </div>

            {/* GALLERY / CREATIONS SECTION */}
            <div id="gallery" className="w-full scroll-mt-[var(--navbar-height)]">
                <GalleryClient />
            </div>

            {/* EXPERIENCES SECTION */}
            <div id="experiences" className="w-full scroll-mt-[var(--navbar-height)]">
                <ExperiencesClient />
            </div>

            {/* CONTACT SECTION */}
            <div id="contact" className="w-full scroll-mt-[var(--navbar-height)]">
                <ContactClient />
            </div>

        </div>
    );
}

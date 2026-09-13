"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faExternalLinkAlt, 
    faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import Article from "@/components/pages/Article";
import { retrieveLanguageByName } from "@/components/utils/ui/Language";
import { PROFESSIONAL_EXPERIENCES } from "@/data/portfolio";

function TechIcon({ name }: { name: string }) {
    const url = retrieveLanguageByName(name);
    if (!url) return null;

    // Invert black NextJS, GitHub & Bash logos to white using CSS filters
    const filterStyle = (name.toLowerCase() === "nextjs" || name.toLowerCase() === "github" || name.toLowerCase() === "bash") ? { filter: "brightness(0) invert(1)" } : undefined;

    return (
        <div className="relative group/tooltip flex items-center justify-center size-10 select-none shrink-0">
            <Image
                src={url} 
                alt={name} 
                width={28}
                height={28}
                unoptimized
                className="size-7 shrink-0 object-contain transition-transform duration-300 group-hover/tooltip:scale-110" 
                style={filterStyle}
                loading="lazy" 
            />
            {/* Premium Tooltip */}
            <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 origin-bottom bg-[#080808]/95 border border-white/10 text-[9px] text-white font-secondary font-extrabold uppercase tracking-widest py-1 px-2.5 rounded-md whitespace-nowrap shadow-xl pointer-events-none select-none z-30">
                {name}
            </span>
        </div>
    );
}

export default function ExperiencesClient() {
    const t = useTranslations("experiences");
    const t_professional = useTranslations("experiences.professional_experiences");
    const t_tags = useTranslations("tags");

    const [activeIdx, setActiveIdx] = useState(0);

    const activeExp = PROFESSIONAL_EXPERIENCES[activeIdx];
    const expPath = `contents.${activeExp.key}`;
    const role = t_professional(`${expPath}.role`);
    const company = t_professional(`${expPath}.title`);
    const description = t_professional(`${expPath}.description`);

    return (
        <Article title={t("title")} description={t("description")} pill={t("title")}>
            <div className="w-full bg-transparent text-white overflow-visible selection:bg-accent-blue selection:text-white relative pb-24">
                
                {/* Experiences Container */}
                <div className="w-full relative max-w-6xl mx-auto px-6 sm:px-8 mt-12 overflow-visible z-10">
                    
                    <div className="flex flex-col md:flex-row w-full bg-secondary/50 border border-white/5 rounded-[24px] overflow-hidden relative">

                        {/* Tabs list */}
                        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-white/10 shrink-0 md:w-64 bg-white/[0.005] no-scrollbar select-none">
                            {PROFESSIONAL_EXPERIENCES.map((exp, idx) => {
                                const isActive = activeIdx === idx;
                                const expTitle = t_professional(`contents.${exp.key}.title`);
                                const expDate = t_professional(`contents.${exp.key}.date`);
                                return (
                                    <button
                                        key={exp.key}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`px-4 py-3.5 text-left transition-all duration-300 border-b-2 md:border-b-0 md:border-l-2 cursor-pointer flex items-center gap-3 shrink-0 ${
                                            isActive 
                                                ? "bg-white/[0.03] border-accent-blue text-accent-blue font-black" 
                                                : "border-transparent text-gray-500 hover:text-white hover:bg-white/[0.01]"
                                        }`}
                                    >
                                        {/* Small Logo Badge */}
                                        <div className="relative size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            <Image
                                                src={exp.image}
                                                alt={expTitle}
                                                fill={true}
                                                className="object-contain p-1"
                                                sizes="32px"
                                            />
                                        </div>
                                        {/* Title & Date */}
                                        <div className="flex flex-col text-left">
                                            <span className={`text-sm sm:text-base font-bold tracking-wide transition-colors duration-300 ${isActive ? "text-accent-blue" : "text-gray-300"}`}>
                                                {expTitle}
                                            </span>
                                            <span className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-medium capitalize">
                                                {expDate}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Details panel */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 relative h-[600px] sm:h-[540px] md:h-[480px] overflow-y-auto no-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIdx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="flex flex-col gap-5"
                                >
                                    {/* Header: Title, Tags & Links */}
                                    <div className="flex flex-row items-start justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            {/* The job comes first, the employer sits under it */}
                                            <h3 className="font-primary text-2xl font-extrabold text-white tracking-tight leading-tight">
                                                {role}
                                            </h3>
                                            <span className="font-secondary text-sm text-gray-500 font-semibold -mt-0.5">
                                                {company}
                                            </span>
                                            {/* Tags */}
                                            {activeExp.tags && (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {activeExp.tags.map((tag: string) => (
                                                        <span key={tag} className="bg-accent-teal/15 border border-accent-teal/30 text-accent-teal px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold font-secondary">
                                                            {t_tags(tag)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Links */}
                                        {activeExp.links && (
                                            <div className="flex items-center gap-3 shrink-0">
                                                {activeExp.links.map((link: any, i: number) => (
                                                    <Link 
                                                        key={i} 
                                                        href={link.href} 
                                                        target="_blank" 
                                                        className="text-gray-400 hover:text-accent-blue transition-colors duration-300 cursor-pointer p-1"
                                                        title={link.name}
                                                    >
                                                        <FontAwesomeIcon icon={link.icon || faExternalLinkAlt} className="size-5" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Company Description */}
                                    <p className="font-secondary text-sm text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                                        {description}
                                    </p>

                                    {/* Tasks List */}
                                    {activeExp.tasks && activeExp.tasks.length > 0 && (
                                        <ul className="flex flex-col gap-3 mt-2">
                                            {activeExp.tasks.map((taskKey: string) => {
                                                const taskText = t_professional(`contents.${activeExp.key}.tasks.${taskKey}`);
                                                return (
                                                    <li key={taskKey} className="flex items-start gap-3 text-sm text-gray-300 font-secondary leading-relaxed">
                                                        <span className="text-accent-blue font-bold mt-1 select-none shrink-0 text-xs">▹</span>
                                                        <span>{taskText}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {/* Languages Tech Stack */}
                                    {activeExp.languages && activeExp.languages.length > 0 && (
                                        <div className="flex flex-col gap-3 mt-4 pt-5 border-t border-white/5">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-extrabold font-secondary">
                                                {t("technologies")}
                                            </span>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {activeExp.languages.map((lang: string) => (
                                                    <TechIcon key={lang} name={lang} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </Article>
    );
}

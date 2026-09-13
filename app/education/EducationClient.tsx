"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { SCHOOLS } from "@/data/portfolio";

export default function EducationClient() {
    const t = useTranslations("education");
    const t_career = useTranslations("education.school_career");

    return (
        <article className="relative w-full bg-transparent text-white overflow-visible selection:bg-accent-blue selection:text-white">
            {/* Visual guide markers reminiscent of premium Webflow layouts */}
            <div className="absolute top-0 left-[15%] w-[1px] h-full bg-white/2 pointer-events-none" />
            <div className="absolute top-0 right-[15%] w-[1px] h-full bg-white/2 pointer-events-none" />

            {/* Section Intro Header */}
            <div className="mx-auto max-w-7xl px-8 pt-32 sm:pt-36 pb-12 flex flex-col items-center text-center relative z-10 select-none">
                <h1 className="font-primary text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-6 leading-none break-words max-w-full">
                    {t("title")}
                </h1>
                <p className="font-secondary text-base md:text-lg text-gray-400 mt-4 max-w-2xl leading-relaxed">
                    {t_career("description")}
                </p>
            </div>

            {/* VERTICAL TIMELINE CONTAINER */}
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 relative z-10">

                {/* Timeline Items List */}
                <div className="flex flex-col gap-12 sm:gap-16 relative">

                    {/* 
                      Timeline spine. It lives inside the list, not in the padded
                      container, so that `left-7 sm:left-9 md:left-1/2` resolves against
                      exactly the same box as the nodes below — measuring it from the
                      container instead left it offset by that container's own padding.
                    */}
                    <div className="absolute left-7 sm:left-9 md:left-1/2 -translate-x-1/2 -top-8 -bottom-4 w-[2px] bg-gradient-to-b from-accent-blue via-accent-teal to-accent-blue/10 pointer-events-none">
                        <div className="absolute inset-0 w-full h-full shadow-[0_0_12px_rgba(78,168,255,0.4)]" />
                    </div>

                    {SCHOOLS.map((school, index) => {
                        const schoolPath = `schools.${school.key}`;
                        const isEven = index % 2 === 0;
                        const glowClass = school.glow === "orange" ? "glow-card-teal" : "glow-card-blue";
                        const activeAccent = school.glow === "orange" ? "text-accent-teal" : "text-accent-blue";
                        const haloColor = school.glow === "orange" ? "bg-accent-teal" : "bg-accent-blue";

                        return (
                            <div key={school.key} className="relative w-full flex items-center">

                                {/* Glowing Node on Timeline Spine */}
                                <div className="absolute left-7 sm:left-9 md:left-1/2 -translate-x-1/2 top-8 z-30 flex items-center justify-center pointer-events-none">
                                    {/* Ripple Halo */}
                                    <div className={`absolute w-8 h-8 rounded-full opacity-20 animate-ping ${haloColor}`} />
                                    <div className={`absolute w-6 h-6 rounded-full opacity-30 animate-pulse ${haloColor}`} />
                                    
                                    {/* Core Node */}
                                    <div className="w-4 h-4 rounded-full border-2 border-white/40 bg-[#080808] flex items-center justify-center relative z-10 shadow-[0_0_10px_rgba(78,168,255,0.5)]">
                                        <div className={`w-2 h-2 rounded-full ${haloColor}`} />
                                    </div>
                                </div>

                                {/* Timeline Card Item */}
                                <motion.div
                                    initial={{ opacity: 0, y: 35 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className={`w-full ml-12 sm:ml-16 md:ml-0 md:w-[calc(50%-36px)] ${
                                        isEven ? "md:mr-auto" : "md:ml-auto"
                                    }`}
                                >
                                    <Link
                                        href={school.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block bg-secondary/60 rounded-3xl p-6 sm:p-8 border border-white/8 ${glowClass} flex flex-col gap-4 overflow-hidden interactive-card group hover:border-accent-blue/40 transition-all duration-300 transform-gpu relative cursor-pointer`}
                                        data-cursor-text="STUDY"
                                    >
                                        {/* Ambient Corner Hover Glow */}
                                        <div className={`absolute top-0 right-0 w-[180px] h-[180px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${school.glow === 'orange' ? 'bg-accent-teal/10' : 'bg-accent-blue/10'}`} />

                                        {/* Header: Timestamp Pill & Index Counter */}
                                        <div className="flex items-center justify-between gap-3 select-none">
                                            <div className="flex items-center gap-1.5 text-gray-200 font-mono text-[11px] sm:text-xs bg-white/[0.04] border border-white/10 rounded-md px-2.5 sm:px-3 py-1 w-max">
                                                <FontAwesomeIcon icon={faCalendarAlt} className={`size-3 sm:size-3.5 ${activeAccent}`} />
                                                <span className="uppercase tracking-wider font-semibold">
                                                    {t_career(`${schoolPath}.date`)}
                                                </span>
                                            </div>
                                            <span className="font-mono text-[11px] sm:text-xs font-semibold text-gray-500">
                                                0{index + 1}
                                            </span>
                                        </div>

                                        {/* Milestone Title, Institution & Description */}
                                        <div className={`flex flex-col gap-2 mt-1 ${school.image ? "border-b border-white/5 pb-5" : ""}`}>
                                            <h3 className="font-primary text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight group-hover:text-accent-blue transition-colors duration-300">
                                                {t_career(`${schoolPath}.title`)}
                                            </h3>
                                            <span className={`text-xs sm:text-sm font-secondary font-bold tracking-wide ${activeAccent}`}>
                                                {t_career(`${schoolPath}.institution`)}
                                            </span>
                                            <p className="font-secondary text-sm text-gray-400 leading-relaxed mt-1.5">
                                                {t_career(`${schoolPath}.description`)}
                                            </p>
                                        </div>

                                        {/* School Crest Logo Asset */}
                                        {school.image && (
                                            <div className="mt-1 relative w-full h-[45px] flex items-center justify-start opacity-90 select-none pointer-events-none">
                                                <Image
                                                    className="object-contain object-left filter brightness-95 contrast-105"
                                                    src={school.image}
                                                    width={140}
                                                    height={38}
                                                    style={{ height: "auto" }}
                                                    alt={t_career(`${schoolPath}.institution`)}
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </article>
    );
}

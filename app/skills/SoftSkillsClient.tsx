"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SOFT_SKILLS_DATA } from "@/data/portfolio";

function SoftSkillBadge({ skill }: { skill: typeof SOFT_SKILLS_DATA[number] }) {
    const t = useTranslations("skills.soft_skills");
    const ref = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    // Each badge owns its scroll interval: no shared trigger or timed cascade.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.92", "start 0.62"]
    });
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
    const clipPath = "polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%)";

    return (
        <div ref={ref} className="py-5 sm:py-8 lg:py-12">
            <motion.div
                style={reduceMotion ? undefined : { opacity, y }}
                className="relative isolate group"
            >
                <div aria-hidden="true" className="absolute inset-0 translate-x-1 translate-y-2 sm:translate-x-2"
                    style={{ clipPath, backgroundColor: `${skill.color}25` }} />
                <div className="relative p-px" style={{ clipPath, backgroundColor: `${skill.color}45` }}>
                    <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5 px-7 py-6 sm:px-9 sm:py-8 bg-[#0b1019]"
                        style={{ clipPath }}>
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
                            style={{ background: `linear-gradient(110deg, ${skill.color}12, transparent 65%)` }} />
                        <div className="relative flex items-center justify-between w-full sm:w-auto sm:shrink-0">
                            <div className="flex size-11 items-center justify-center border -skew-x-12"
                                style={{ borderColor: `${skill.color}40`, backgroundColor: `${skill.color}12`, color: skill.color }}>
                                <FontAwesomeIcon icon={skill.icon} className="size-5 skew-x-12" />
                            </div>                        </div>
                        <div className="relative flex flex-col gap-2 flex-1 min-w-0">
                            <h3 className="font-primary text-base sm:text-lg font-extrabold tracking-tight uppercase" style={{ color: skill.color }}>
                                {t(`contents.${skill.key}.title`)}
                            </h3>
                            <p className="font-secondary text-sm sm:text-base text-gray-400 leading-relaxed">
                                {t(`contents.${skill.key}.description`)}
                            </p>
                        </div>                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function SoftSkillsClient() {
    const t = useTranslations("skills.soft_skills");

    return (
        <article className="relative w-full bg-transparent text-white selection:bg-accent-blue selection:text-white">
            <div aria-hidden="true" className="absolute top-0 left-[15%] w-px h-full bg-white/2 pointer-events-none" />
            <div aria-hidden="true" className="absolute top-0 right-[15%] w-px h-full bg-white/2 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 sm:py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-[120px] lg:pt-12 flex flex-col gap-4">
                        <h2 className="font-primary text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                            {t("title")}
                        </h2>
                        <p className="font-secondary text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
                            {t("description")}
                        </p>
                    </div>
                    <div className="lg:col-span-7 min-w-0">
                        {SOFT_SKILLS_DATA.map(skill => <SoftSkillBadge key={skill.key} skill={skill} />)}
                    </div>
                </div>
            </div>
        </article>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faMapMarkerAlt,
    faClock,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const MAIL = "contact@agonkolgeci.com";
const CTA_CLIP_PATH = "polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    }),
};

export default function ContactClient() {
    const t = useTranslations("contact.contact_form");
    const t_s = useTranslations("contact");

    const [time, setTime] = useState("");

    useEffect(() => {
        const tick = () => {
            setTime(
                new Date().toLocaleTimeString("en-US", {
                    timeZone: "Europe/Zurich",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            id="contact"
            className="w-full relative text-white selection:bg-accent-blue selection:text-white"
        >
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 flex flex-col gap-16">

                {/* ── Hero CTA ─────────────────────────────────────────── */}
                <motion.div
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center gap-8"
                >
                    {/* Eyebrow */}
                    <span className="text-[10px] uppercase tracking-[0.3em] text-accent-blue font-extrabold font-secondary select-none">
                        {t_s("title")}
                    </span>

                    {/* Big title */}
                    <h2 className="font-primary text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[0.95]">
                        {t("title")}
                    </h2>

                    {/* Sub-description */}
                    <p className="font-secondary text-sm sm:text-base text-gray-400 leading-relaxed max-w-lg">
                        {t("description")}
                    </p>

                    {/* mailto CTA */}
                    {/* Parallelogram, layered like the soft skills cards: offset shadow, 1px border, body */}
                    <Link
                        href={`mailto:${MAIL}`}
                        className="group relative isolate inline-flex max-w-full select-none"
                    >
                        <span aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-accent-blue/20 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
                            style={{ clipPath: CTA_CLIP_PATH }} />
                        <span className="relative flex max-w-full p-px bg-accent-blue/50 transition-colors duration-300 group-hover:bg-accent-blue"
                            style={{ clipPath: CTA_CLIP_PATH }}>
                            <span className="flex max-w-full items-center gap-3 sm:gap-4 pl-8 pr-7 sm:pl-10 sm:pr-9 py-3.5 sm:py-4 bg-[#0b1019] text-white transition-colors duration-300 group-hover:bg-[#12213a]"
                                style={{ clipPath: CTA_CLIP_PATH }}>
                                <FontAwesomeIcon icon={faEnvelope} className="size-4 sm:size-5 shrink-0 text-accent-blue" />
                                <span className="min-w-0 truncate font-secondary font-bold text-sm sm:text-lg tracking-wide">{MAIL}</span>
                            </span>
                        </span>
                    </Link>
                </motion.div>

                {/* ── Bento Grid ───────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Live Clock */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-secondary/20 border border-white/5 rounded-[20px] p-6 flex flex-col gap-4 relative overflow-hidden select-none"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faClock} className="size-3.5 text-accent-blue" />
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold font-secondary">
                                {t_s("geneva_time")}
                            </span>
                        </div>
                        <div className="font-primary text-3xl sm:text-4xl font-extrabold tracking-wider text-accent-blue tabular-nums drop-shadow-[0_0_20px_rgba(78,168,255,0.4)]">
                            {time || "00:00:00"}
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold font-secondary">
                            {t_s("ticking_live")}
                        </span>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-secondary/20 border border-white/5 rounded-[20px] p-6 flex flex-col gap-4 relative overflow-hidden select-none"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="size-3.5 text-accent-teal" />
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold font-secondary">
                                {t_s("current_base")}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 flex-1">
                            {/* Radar */}
                            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                                <span className="absolute w-full h-full rounded-full bg-accent-teal/20 animate-ping" />
                                <span className="absolute w-5 h-5 rounded-full bg-accent-teal/30 animate-pulse" />
                                <span className="absolute w-2.5 h-2.5 rounded-full bg-accent-teal" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-primary text-lg font-extrabold text-white tracking-tight">
                                    Geneva, Switzerland
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold font-secondary mt-0.5">
                                    {t_s("borders")}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Connect */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-secondary/20 border border-white/5 rounded-[20px] p-6 flex flex-col gap-4 relative overflow-hidden sm:col-span-2 lg:col-span-1"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faBolt} className="size-3.5 text-accent-blue" />
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold font-secondary">
                                {t_s("quick_connect")}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {[
                                {
                                    href: `mailto:${MAIL}`,
                                    icon: faEnvelope,
                                    iconClass: "text-accent-blue",
                                    label: MAIL,
                                    blank: false,
                                },
                                {
                                    href: "https://github.com/agonkolgeci",
                                    icon: faGithub,
                                    iconClass: "text-white",
                                    label: "github.com/agonkolgeci",
                                    blank: true,
                                },
                                {
                                    href: "https://www.linkedin.com/in/agon-kolgeci/",
                                    icon: faLinkedin,
                                    iconClass: "text-blue-400",
                                    label: "linkedin.com/in/agon-kolgeci",
                                    blank: true,
                                },
                            ].map(({ href, icon, iconClass, label, blank }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    target={blank ? "_blank" : undefined}
                                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={icon} className={`size-4 shrink-0 ${iconClass}`} />
                                    <span className="font-secondary text-xs text-gray-400 group-hover:text-white transition-colors duration-300 truncate">
                                        {label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

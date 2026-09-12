"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useMotionValueEvent, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Article from "@/components/pages/Article";
import { retrieveLanguageByName } from "@/components/utils/ui/Language";
import MacBook, { DECK_OVERHANG } from "@/components/utils/ui/MacBook";

// All 32 GitHub core technologies and tools divided into 3 scroll steps (10 in step 1, 9 in step 2, 13 in step 3)
const TECH_CONSTELLATION = [
    // Step 1: Core Languages (10 items)
    { name: "Java", color: "#f89820", angle: 36, ring: 2, step: 1 },
    { name: "JavaScript", color: "#f7df1e", angle: 72, ring: 1, step: 1 },
    { name: "TypeScript", color: "#3178c6", angle: 0, ring: 1, step: 1 },
    { name: "PHP", color: "#777bb4", angle: 0, ring: 2, step: 1 },
    { name: "Python", color: "#3776ab", angle: 72, ring: 2, step: 1 },
    { name: "C", color: "#a8b9cc", angle: 0, ring: 2, step: 1 },
    { name: "C++", color: "#00599c", angle: 108, ring: 2, step: 1 },
    { name: "HTML", color: "#e34f26", angle: 0, ring: 2, step: 1 },
    { name: "CSS", color: "#1572b6", angle: 0, ring: 2, step: 1 },
    { name: "Sass", color: "#cc6699", angle: 0, ring: 2, step: 1 },
    
    // Step 2: Frameworks, Databases & Core Ops (9 items)
    { name: "Node", color: "#339933", angle: 288, ring: 1, step: 2 },
    { name: "React", color: "#61dafb", angle: 144, ring: 1, step: 2 },
    { name: "NextJS", color: "#ffffff", angle: 216, ring: 1, step: 2 },
    { name: "Tailwind CSS", color: "#38bdf8", angle: 0, ring: 2, step: 2 },
    { name: "Redis", color: "#dc382d", angle: 324, ring: 2, step: 2 },
    { name: "MySQL", color: "#4479a1", angle: 252, ring: 2, step: 2 },
    { name: "MongoDB", color: "#47a248", angle: 288, ring: 2, step: 2 },
    { name: "Docker", color: "#2496ed", angle: 144, ring: 2, step: 2 },
    { name: "Cloudflare", color: "#f38020", angle: 0, ring: 2, step: 2 },
    
    // Step 3: Development Tools, OS & Automations (13 items)
    { name: "VSCode", color: "#007acc", angle: 0, ring: 2, step: 3 },
    { name: "IntelliJ IDEA", color: "#fe315d", angle: 0, ring: 2, step: 3 },
    { name: "Git", color: "#f05032", angle: 216, ring: 2, step: 3 },
    { name: "GitHub", color: "#ffffff", angle: 0, ring: 2, step: 3 },
    { name: "GitLab", color: "#fc6d26", angle: 0, ring: 2, step: 3 },
    { name: "Linux", color: "#ffffff", angle: 180, ring: 2, step: 3 },
    { name: "Jenkins", color: "#d24939", angle: 0, ring: 2, step: 3 },
    { name: "Bash", color: "#4eaa25", angle: 0, ring: 2, step: 3 },
    { name: "PowerShell", color: "#5391fe", angle: 0, ring: 2, step: 3 },
    { name: "Maven", color: "#c71a36", angle: 0, ring: 2, step: 3 },
    { name: "Gradle", color: "#00c6be", angle: 0, ring: 2, step: 3 },
    { name: "Postman", color: "#ff6c37", angle: 0, ring: 2, step: 3 },
    { name: "StackOverflow", color: "#f58025", angle: 0, ring: 2, step: 3 }
];

// Orbit geometry, shared by the badges and by the code that has to know how far
// down the arcs reach in order to balance the pinned frame.
const ORBIT_RADII = [500, 620, 740];
const ORBIT_ANGLE_STEPS = { wide: [11.5, 9.5, 7.2], narrow: [7.2, 5.8, 4.2] };
const ORBIT_BASE_OFFSET = 460;
const ORBIT_BADGE_RADIUS = 40;

// Lowest point the arcs reach under their own centre. Each arc curves downwards
// towards its ends, so this is the outermost badge of whichever row hangs lowest.
function orbitReachBelow(radiusMultiplier: number) {
    const compensation = 1 / Math.max(radiusMultiplier, 0.65);

    return ORBIT_RADII.reduce((lowest, radius, row) => {
        const rowSize = TECH_CONSTELLATION.filter(item => item.step === row + 1).length;
        const halfSpan = ((rowSize - 1) / 2) * ORBIT_ANGLE_STEPS.wide[row] * compensation;
        const y = -radius * radiusMultiplier * Math.cos((halfSpan * Math.PI) / 180)
            + ORBIT_BASE_OFFSET * radiusMultiplier;

        return Math.max(lowest, y);
    }, 0) + ORBIT_BADGE_RADIUS;
}

function TechIcon({ name, className = "size-6" }: { name: string; className?: string }) {
    const url = retrieveLanguageByName(name);
    if (!url) return <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-ping" />;
    
    // Invert black NextJS, GitHub & Bash logos to white using CSS filters
    const filterStyle = (name.toLowerCase() === "nextjs" || name.toLowerCase() === "github" || name.toLowerCase() === "bash") ? { filter: "brightness(0) invert(1)" } : undefined;

    return (
        <Image
            src={url} 
            alt={name} 
            width={32}
            height={32}
            unoptimized
            className={`${className} shrink-0 object-contain hover:scale-110 transition-transform duration-300`} 
            style={filterStyle}
            loading="lazy" 
        />
    );
}

// Child Badge Component: Compliant with React Hook Rules
interface BadgeProps {
    item: typeof TECH_CONSTELLATION[number];
    index: number;
    activeStep: number;
    radiusMultiplier: number;
    isCompactHeight: boolean;
    isNarrowViewport: boolean;
    emitterY: number;
    hoveredTech: string | null;
    onHover: (name: string | null) => void;
}

function ConstellationBadge({ item, activeStep, radiusMultiplier, isCompactHeight, isNarrowViewport, emitterY, hoveredTech, onHover }: BadgeProps) {
    const t = useTranslations("skills");
    
    const rowIndex = item.step - 1; // 0 (Languages), 1 (Frameworks), 2 (Ops)
    
    // Filter elements in the same step/row to compute dynamic column layout indices
    const rowItems = TECH_CONSTELLATION.filter(x => x.step === item.step);
    const colIndex = rowItems.findIndex(x => x.name === item.name);
    const rowSize = rowItems.length;
    
    // Concentric Rainbow Arcs centered slightly below the chest
    // Row 1 (10 items): Radius 500px (narrower circle, holds 10 badges nicely)
    // Row 2 (9 items): Radius 620px (120px vertical gap, holds 9 badges)
    // Row 3 (13 items): Radius 740px (120px vertical gap, wider circle holds 13 badges beautifully)
    const r = ORBIT_RADII[rowIndex] * radiusMultiplier;
    
    // Dynamic angle step based on row index and row size to ensure comfortable spacing without overlaps:
    // We dynamically scale the angle steps on small mobile viewports to prevent horizontal screen clipping
    const angleSteps = isNarrowViewport ? ORBIT_ANGLE_STEPS.narrow : ORBIT_ANGLE_STEPS.wide;
    // Compensate for height-driven radius reduction so adjacent badges keep
    // enough horizontal breathing room instead of collapsing into each other.
    const angleCompensation = 1 / Math.max(radiusMultiplier, isNarrowViewport ? 0.55 : 0.65);
    const angleStep = angleSteps[rowIndex] * angleCompensation;
    
    const angleDeg = (colIndex - (rowSize - 1) / 2) * angleStep;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Symmetrical flatter rainbow arch projection shifted down to align with lowered chest (+128px base translation)
    const finalX = r * Math.sin(angleRad);
    const finalY = -r * Math.cos(angleRad) + ORBIT_BASE_OFFSET * radiusMultiplier; // Shifting entire system down to float perfectly (+128px chest base - offset = +460px)
    
    // Every badge leaves the screen in the same burst, the moment the lid opens.
    // The stagger ripples outwards from the middle of each arc so the icons look
    // like they are being thrown out of the machine rather than switched on.
    const isErupted = activeStep >= 1;
    const distanceFromCentre = Math.abs(colIndex - (rowSize - 1) / 2);
    const delay = isErupted
        ? 0.4 + rowIndex * 0.07 + distanceFromCentre * 0.035
        : distanceFromCentre * 0.02;
    const isHovered = hoveredTech === item.name;
    const [placeTooltipBelow, setPlaceTooltipBelow] = useState(finalY < 0);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        const badgeRect = event.currentTarget.getBoundingClientRect();
        const spaceAbove = badgeRect.top - 84; // Fixed 72px navbar + 12px breathing room
        const spaceBelow = window.innerHeight - badgeRect.bottom - 12;

        // Use the side with the most real viewport space. This remains correct
        // while the sticky section enters and exits, when its local coordinates
        // no longer match its position on screen.
        setPlaceTooltipBelow(spaceBelow >= spaceAbove);
        onHover(item.name);
    };

    // Load translations dynamically
    const t_category = t(`tech_details.${item.name.toLowerCase()}.category`);
    const t_exp = t(`tech_details.${item.name.toLowerCase()}.exp`);
    const t_desc = t(`tech_details.${item.name.toLowerCase()}.desc`);

    return (
        <motion.div
            initial={{ x: 0, y: emitterY, scale: 0, opacity: 0 }}
            animate={{
                x: isErupted ? finalX : 0,
                y: isErupted ? finalY : emitterY,
                scale: isErupted ? 1 : 0,
                opacity: isErupted ? 1 : 0
            }}
            transition={{
                x: { type: "spring", stiffness: 150, damping: 17, delay },
                y: { type: "spring", stiffness: 150, damping: 17, delay },
                scale: { type: "spring", stiffness: 260, damping: 15, delay },
                opacity: { duration: 0.25, delay }
            }}
            className="absolute origin-center cursor-pointer select-none transform-gpu pointer-events-auto z-20 hover:z-[100]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => onHover(null)}
        >
            {/* Static resting badges keep the entrance without a permanent animation loop. */}
            <div
                className={`relative flex items-center justify-center rounded-full bg-[#0a0a0a]/90 border border-white/6 hover:border-accent-blue/40 shadow-lg transition-all duration-300 group ${isCompactHeight ? "size-14" : "size-14 sm:size-18 md:size-20"}`}
                style={{
                    boxShadow: isHovered ? `0 0 25px ${item.color}35` : "none",
                    borderColor: isHovered ? `${item.color}40` : "rgba(255, 255, 255, 0.06)"
                }}
            >
                {/* Neon shadow aura backdrop */}
                <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${item.color}25 0%, transparent 70%)`
                    }}
                />
                
                <TechIcon name={item.name} className={isCompactHeight ? "size-8" : "size-8 sm:size-10 md:size-12"} />

                {/* Minimal label (fades in on hover underneath badge if tooltip isn't captured) */}
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[8px] uppercase tracking-widest font-extrabold font-secondary text-gray-400 whitespace-nowrap bg-black/75 px-2 py-0.5 rounded border border-white/5 pointer-events-none">
                    {item.name}
                </span>
            </div>

            {/* Mount only the active tooltip instead of keeping 32 hidden panels. */}
            {isHovered && <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                    scale: isHovered ? 1 : 0.95,
                    pointerEvents: isHovered ? "auto" : "none"
                }}
                transition={{ type: "spring", stiffness: 150, damping: 18 }}
                className={`absolute left-1/2 -translate-x-1/2 w-64 p-5 bg-[#050505]/95 ${placeTooltipBelow ? "top-full mt-5" : "bottom-full mb-5"} border border-white/10 rounded-2xl shadow-2xl z-[999] pointer-events-none text-left flex flex-col gap-3 selection:bg-accent-blue selection:text-white border-t-2`}
                style={{
                    borderTopColor: item.color,
                    boxShadow: `0 10px 30px -5px rgba(0,0,0,0.8), 0 0 15px ${item.color}20`,
                    borderColor: `${item.color}30`
                }}
            >
                {/* Ambient neon radial glow inside card */}
                <div 
                    className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`
                    }}
                />
                
                {/* Header: Title, Category, Exp */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex flex-col">
                        <h4 className="font-primary text-sm font-bold text-white tracking-tight leading-none">{item.name}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-accent-blue font-extrabold font-secondary mt-1">{t_category}</span>
                    </div>
                    <span className="text-[9px] font-secondary font-extrabold uppercase text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {t_exp}
                    </span>
                </div>
                
                {/* Description */}
                <p className="font-secondary text-[11px] text-gray-300 leading-relaxed font-semibold">
                    {t_desc}
                </p>
            </motion.div>}
        </motion.div>
    );
}

export default function SkillsClient() {
    const t = useTranslations("skills");

    // Ref and states
    const containerRef = useRef<HTMLDivElement>(null);
    const mobileLaptopRef = useRef<HTMLDivElement>(null);
    const mobileLaptopVisible = useInView(mobileLaptopRef, { once: true, amount: 0.3 });
    const reduceMotion = useReducedMotion();
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);
    const [radiusMultiplier, setRadiusMultiplier] = useState(1);
    const [isCompactHeight, setIsCompactHeight] = useState(false);
    const [isNarrowViewport, setIsNarrowViewport] = useState(false);
    // Below lg the badges are a grid under the machine instead of orbits around it,
    // so the deck goes back into the flow instead of hanging over what follows.
    const [usesBadgeGrid, setUsesBadgeGrid] = useState(true);
    // Extra push applied to the whole composition so the pinned frame has the same
    // breathing room above the heading as below the machine.
    const [contentOffset, setContentOffset] = useState(0);
    const [laptopScale, setLaptopScale] = useState(1);
    const [activeStep, setActiveStep] = useState(0);

    // Track scroll coordinates over the pinned parent timeline height
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Reactive scroll lock trigger - unlocks early in the scroll so the user enjoys all badges before leaving
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        let newStep = 0;
        if (latest <= 0.02) {
            newStep = 0;
        } else if (latest <= 0.18) {
            newStep = 1;
        } else if (latest <= 0.38) {
            newStep = 2;
        } else {
            newStep = 3;
        }

        // identity gate: only trigger state update if the step actually changed!
        setActiveStep((prev) => {
            if (prev !== newStep) {
                return newStep;
            }
            return prev;
        });
    });

    // Scale against both viewport axes. The original layout only considered
    // width, which left the full 740px orbit active on short desktop windows.
    useEffect(() => {
        let lastWidth = 0;
        let lastHeight = 0;

        const handleResize = () => {
            /*
              Measured off the document, not `window.inner*`: on phones the URL bar
              collapsing and expanding during a scroll changes `innerHeight` by ~60-100px
              while `100vh` — what the layout is actually built on — stays put. Recomputing
              on that made the whole section grow and shrink as you scrolled, so genuine
              height changes are only honoured past anything a browser chrome can cause.
            */
            const width = document.documentElement.clientWidth;
            const height = document.documentElement.clientHeight;

            if (width === lastWidth && Math.abs(height - lastHeight) < 140) return;
            lastWidth = width;
            lastHeight = height;

            let widthMultiplier = 1;

            if (width < 640) {
                widthMultiplier = 0.55;
            } else if (width < 1024) {
                widthMultiplier = 0.76;
            }

            // 0.49 at 570px, 0.65 at 694px, and 1 at >= 960px.
            const heightMultiplier = Math.min(1, Math.max(0.48, (height - 200) / 760));

            const multiplier = Math.min(widthMultiplier, heightMultiplier);
            setRadiusMultiplier(multiplier);
            setIsCompactHeight(height < 720);
            setIsNarrowViewport(width < 640);
            setUsesBadgeGrid(width < 1024);

            // The MacBook is drawn once at a fixed 460x472 design size, so fitting it
            // to the viewport is a single scale factor. The width steps keep the lid
            // the same size the flat mockup used to be, so the badge arcs still clear it.
            const laptopWidthScale = width < 640 ? 0.5 : width < 1024 ? 0.72 : 0.96;
            // Mobile uses normal flow, so only desktop needs height-based scaling.
            const laptopHeightScale = width < 1024 ? 1 : (height - 300) / 472;
            const scale = Math.max(0.4, Math.min(1, laptopWidthScale, laptopHeightScale));
            setLaptopScale(scale);

            /*
              Vertical balance. The heading is pinned near the top of the frame while
              the arcs are centred on the chamber, and each arc holds far more of its
              badges above its centre than below — so every extra pixel of viewport
              height used to pile up as dead space under the laptop. Push the whole
              composition down by half of that surplus and the two gaps match.
            */
            const stickyHeight = height - 72;
            const chamberTop = height < 720 ? 48 : width < 640 ? 64 : 80;
            const headingTop = height < 720 ? 16 : 32;
            const reachBelow = width < 1024
                ? 0
                : Math.max(orbitReachBelow(multiplier), 256 * scale);
            setContentOffset(reachBelow === 0
                ? 0
                : Math.max(0, (stickyHeight / 2 - chamberTop - headingTop - reachBelow) / 2));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // How far the machine is lifted out of the centre of the chamber, which is
    // also where the display ends up — so the icons fly out of the screen.
    const emitterY = -55 * laptopScale;

    return (
        <Article pill={t("title")}>
            <div className="relative z-10 w-full flex flex-col gap-10 max-w-7xl mx-auto px-8 overflow-visible">
                
                {/* Pin the constellation on desktop; let the mobile grid scroll naturally. */}
                <div ref={containerRef} className="relative w-full overflow-visible lg:h-[135svh]">
                    
                    {/* The pinned frame is only used at desktop widths. */}
                    <div className="relative lg:sticky lg:top-[72px] lg:h-[calc(100svh-72px)] w-full flex flex-col items-center justify-center overflow-visible select-none">


                        {/* 
                          Sticky Section Header. 
                          By placing this inside the sticky viewport container, it remains beautifully visible 
                          at the top of the viewport when the section pins!
                        */}
                        <div
                            className={`relative lg:absolute lg:left-1/2 flex flex-col items-center text-center z-30 select-none w-full max-w-2xl lg:px-6 ${isCompactHeight ? "lg:top-4" : "lg:top-8"}`}
                            style={usesBadgeGrid ? undefined : { transform: `translate(-50%, ${contentOffset}px)` }}
                        >
                            <h2 className={`font-primary font-extrabold tracking-tight leading-none text-white ${isCompactHeight ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}>
                                {t("title")}
                            </h2>
                            <p className="font-secondary text-xs sm:text-sm text-gray-400 mt-3 max-w-xl leading-relaxed">
                                {t("description")}
                            </p>
                        </div>

                        {/* Centered chamber container */}
                        <div
                            className={`relative w-full max-w-5xl lg:h-full flex flex-col items-center justify-center overflow-visible ${isCompactHeight ? "mt-8 lg:mt-12" : "mt-8 lg:mt-20"}`}
                            style={{ transform: `translateY(${contentOffset}px)` }}
                        >
                            
                            {/* Ambient Radiant Screen Light Beam from Open Laptop */}
                            <motion.div
                                animate={{
                                    opacity: activeStep >= 1 ? 0.75 : 0,
                                    scale: activeStep >= 1 ? 1 : 0.6
                                }}
                                transition={{
                                    type: "tween",
                                    ease: [0.25, 1, 0.5, 1],
                                    duration: 1.2,
                                    delay: activeStep >= 1 ? 0.2 : 0
                                }}
                                className="hidden lg:block absolute bottom-[50%] left-1/2 -translate-x-1/2 w-80 sm:w-96 md:w-[460px] h-[360px] bg-gradient-to-t from-blue-600/30 via-cyan-500/15 to-transparent blur-3xl rounded-full origin-bottom pointer-events-none z-0 translate-y-24"
                            />

                            {/* 
                              The MacBook itself — a real CSS 3D machine that swings open on its hinge.
                              The negative bottom margin pulls the foreshortened deck out of the flow so
                              the lid stays centred in the chamber and the keyboard simply hangs below it.
                            */}
                            <div
                                ref={mobileLaptopRef}
                                className="relative z-10 flex items-start justify-center"
                                style={usesBadgeGrid ? undefined : {
                                    marginBottom: -DECK_OVERHANG * laptopScale,
                                    transform: `translateY(${emitterY}px)`
                                }}
                            >
                                <MacBook open={reduceMotion || (usesBadgeGrid ? mobileLaptopVisible : activeStep >= 1)} scale={laptopScale} />
                            </div>

                            {/*
                              PROJECTED BADGES ORBIT matrix.
                              The arcs need a desktop viewport, so they only exist from `lg`
                              up. The wrapper reproduces the chamber's centring, which is what the
                              absolutely positioned badges measure their orbit from.
                            */}
                            <div className="absolute inset-0 z-20 hidden lg:flex items-center justify-center pointer-events-none overflow-visible">
                                {!usesBadgeGrid && TECH_CONSTELLATION.map((item, index) => (
                                    <ConstellationBadge
                                        key={item.name}
                                        item={item}
                                        index={index}
                                        activeStep={activeStep}
                                        radiusMultiplier={radiusMultiplier}
                                        isCompactHeight={isCompactHeight}
                                        isNarrowViewport={isNarrowViewport}
                                        emitterY={emitterY}
                                        hoveredTech={hoveredTech}
                                        onHover={setHoveredTech}
                                    />
                                ))}
                            </div>

                            {/* Mobile stays in normal flow; each icon reveals as it enters view. */}
                            <div className="lg:hidden relative z-10 mt-6 mb-12 grid grid-cols-3 min-[360px]:grid-cols-4 sm:grid-cols-8 gap-3 w-full max-w-[560px]">
                                {TECH_CONSTELLATION.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : (index % 4) * 0.045 }}
                                        className="flex min-w-0 flex-col items-center gap-2 py-2"
                                    >
                                        <div className="size-11 rounded-full bg-[#0a0a0a]/90 border border-white/10 flex items-center justify-center shrink-0">
                                            <TechIcon name={item.name} className="size-6" />
                                        </div>
                                        <span className="font-secondary text-[10px] leading-tight text-gray-400 text-center break-words w-full">{item.name}</span>
                                    </motion.div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </Article>
    );
}

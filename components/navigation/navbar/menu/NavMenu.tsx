"use client";

import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "../../../utils/links/menu";
import SocialsLinks from "../../socials/SocialsLinks";
import NavLogo from "../logo/NavLogo";

export default function NavMenu() {
    const pathname = usePathname();
    const links = useMenu();
    const [opened, setOpened] = useState(false);
    const [activeHash, setActiveHash] = useState("#home");

    const toggleMenu = useCallback(() => setOpened(curr => !curr), []);
    const closeMenu = useCallback(() => setOpened(false), []);

    // IntersectionObserver to highlight active sections on scroll
    useEffect(() => {
        if (pathname !== "/") return;

        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px", // Trigger when section occupies screen center
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (id) {
                        setActiveHash("#" + id);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = ["home", "skills", "education", "gallery", "experiences", "contact"];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Initialize active hash on mount
        const frame = window.requestAnimationFrame(() => {
            if (window.location.hash) {
                setActiveHash(window.location.hash);
            }
        });

        return () => {
            window.cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [pathname]);

    // Lock page scroll while the mobile drawer is open
    useEffect(() => {
        if (!opened) return;

        const { body, documentElement } = document;
        const previousHtmlOverflow = documentElement.style.overflow;
        const previousBodyOverflow = body.style.overflow;
        documentElement.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            documentElement.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
        };
    }, [opened]);

    // Handle scroll intercept for same-page anchors
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === "/") {
            const hashIndex = href.indexOf("#");
            if (hashIndex !== -1) {
                const targetId = href.substring(hashIndex + 1);
                const element = document.getElementById(targetId);
                if (element) {
                    e.preventDefault();
                    window.history.pushState(null, "", href);
                    setActiveHash("#" + targetId);
                    closeMenu();
                    // Wait for the scroll lock to be released before scrolling
                    window.requestAnimationFrame(() => element.scrollIntoView({ behavior: "smooth" }));
                }
            }
        } else {
            closeMenu();
        }
    };

    // Staggered Motion entries for mobile links
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="flex flex-row items-center">
            {/* DESKTOP VIEW */}
            <ul className="hidden lg:flex flex-row gap-8 items-center font-semibold">
                {links.map(link => {
                    const linkHash = link.href.includes("#") ? link.href.substring(link.href.indexOf("#")) : "";
                    const isActive = pathname === "/" ? activeHash === linkHash : false;
                    return (
                        <li key={link.name} className="relative py-2">
                            <Link
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`font-secondary text-[10px] tracking-[0.2em] font-extrabold uppercase transition-colors duration-300 block select-none cursor-pointer ${isActive ? "text-accent-blue" : "text-gray-400 hover:text-white"}`}
                            >
                                {link.name}
                            </Link>
                            {isActive && (
                                <motion.span
                                    layoutId="activeNavIndicator"
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-blue rounded-full shadow-[0_0_8px_rgba(78,168,255,0.8)]"
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}
                        </li>
                    )
                })}
            </ul>

            {/* TABLET/MOBILE TRIGGER BUTTON */}
            <div className="flex lg:hidden flex-row items-center relative">
                <button 
                    onClick={toggleMenu} 
                    aria-label="Toggle menu"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer"
                >
                    <FontAwesomeIcon className="size-4" icon={opened ? faClose : faBars} />
                </button>

                {/* FULL SCREEN DOCK/DRAWER MENU */}
                <AnimatePresence>
                    {opened && (
                        <motion.div
                            initial={{ opacity: 0, y: "-100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "-100%" }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 w-screen h-screen bg-[#030303] z-[9999] flex flex-col justify-between px-6 md:px-12 pb-6 sm:pb-10 overflow-hidden overscroll-none touch-none"
                        >
                            {/* Drawer Header: same height/padding as the site header so logo and button don't jump */}
                            <div className="flex flex-row items-center justify-between w-full h-[72px] shrink-0 border-b border-white/5">
                                <div className="flex items-center w-[130px] h-[34px] relative shrink-0" onClick={closeMenu}>
                                    <NavLogo />
                                </div>
                                <button 
                                    onClick={closeMenu}
                                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-accent-blue/30 bg-white/3 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                                >
                                    <FontAwesomeIcon className="size-4" icon={faClose} />
                                </button>
                            </div>

                            {/* Drawer Links Matrix */}
                            <div className="flex-1 min-h-0 flex flex-col justify-center py-8">
                                <motion.ul
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="flex flex-col gap-4 sm:gap-6 items-start max-w-full"
                                >
                                    {links.map(link => {
                                        const linkHash = link.href.includes("#") ? link.href.substring(link.href.indexOf("#")) : "";
                                        const isActive = pathname === "/" ? activeHash === linkHash : false;
                                        return (
                                            <motion.li 
                                                variants={itemVariants} 
                                                key={link.name} 
                                                className="relative"
                                            >
                                                <Link 
                                                    href={link.href} 
                                                    onClick={(e) => handleNavClick(e, link.href)}
                                                    className={`font-primary text-[clamp(1.5rem,6.5vw,3.25rem)] leading-[1.1] font-extrabold tracking-tight uppercase break-words transition-all duration-300 block hover:translate-x-2 select-none hover:text-accent-blue ${isActive ? "text-accent-blue font-black" : "text-gray-500 hover:text-white"}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </motion.li>
                                        )
                                    })}
                                </motion.ul>
                            </div>

                            {/* Drawer Footer */}
                            <div className="flex flex-row items-center w-full border-t border-white/5 pt-6 gap-4">
                                <span className="text-[10px] font-secondary uppercase tracking-[0.2em] text-gray-500 font-extrabold select-none">Connect</span>
                                <SocialsLinks className="flex flex-row gap-6 text-lg text-gray-400 hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

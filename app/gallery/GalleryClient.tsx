"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCodeFork, faStar, faFolderOpen, 
    faUsers, faFilter, faArchive, faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { retrieveLanguageByName } from "@/components/utils/ui/Language";
import Article from "@/components/pages/Article";
import { retrieveRepositories, Repository } from "@/components/utils/api/github";
import { PROJECTS } from "@/data/portfolio";

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

function ProjectCard({ project }: { project: any }) {
    const t_projects = useTranslations("gallery.projects");
    const t_tags = useTranslations("tags");
    const t_team = useTranslations("team");

    const projectPath = `contents.${project.key}`;
    const title = t_projects(`${projectPath}.title`);
    const date = t_projects(`${projectPath}.date`);
    const description = t_projects(`${projectPath}.description`);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -6 }}
            className="bg-secondary/50 rounded-[32px] border border-white/5 glow-card-blue flex flex-col overflow-hidden relative group interactive-card transition-[border-color,box-shadow,background-color] duration-300 w-full h-full shadow-lg hover:shadow-2xl"
            data-cursor-text="VISIT"
        >
            {/* Ambient corner light glow */}
            <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full blur-[70px] bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Cover Image Wrapper */}
            <div className="w-full h-[180px] sm:h-[220px] relative overflow-hidden shrink-0 shadow-md">
                <Image
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    src={project.image}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, 480px"
                    alt={title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
            </div>

            {/* Details Wrapper */}
            <div className="p-6 sm:p-8 flex flex-col gap-6 flex-1 justify-between">
                
                {/* Header: Date above, Title, Role Tags below */}
                <div className="flex flex-col gap-2.5">
                    
                    {/* Timestamp Pill */}
                    <div className="flex items-center gap-1.5 text-gray-200 font-mono text-[10px] bg-white/5 border border-white/5 rounded-md px-2.5 py-1 w-max select-none">
                        <FontAwesomeIcon icon={faCalendarAlt} className="size-3 text-accent-blue" />
                        <span className="uppercase tracking-wider font-semibold">{date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-primary text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-accent-blue transition-colors duration-300 leading-snug">
                        {project.links && project.links[0] ? (
                            <Link 
                                href={project.links[0].href} 
                                target="_blank" 
                                className="after:absolute after:inset-0 after:z-10 cursor-pointer"
                            >
                                {title}
                            </Link>
                        ) : (
                            title
                        )}
                    </h3>

                    {/* Role Tags */}
                    {project.tags && (
                        <div className="flex flex-wrap gap-2 select-none relative z-20 pointer-events-none mt-0.5">
                            {project.tags?.map((tag: string) => {
                                const isUnige = tag === "unige";
                                return (
                                    <span 
                                        key={tag} 
                                        className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold font-secondary border ${
                                            isUnige 
                                                ? "bg-[#CF0063]/15 border-[#CF0063]/35 text-[#ff5e97]" 
                                                : "bg-accent-teal/15 border-accent-teal/30 text-accent-teal"
                                        }`}
                                    >
                                        {t_tags(tag)}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="font-secondary text-sm text-gray-300 leading-relaxed">
                    {description}
                </p>

                {/* Tech & Team Row */}
                <div className="flex flex-col gap-4 mt-auto">
                    {/* Language Icons */}
                    {project.languages && (
                        <div className="flex flex-wrap items-center gap-3 select-none relative z-20 shrink-0">
                            {project.languages.map((lang: string) => (
                                <TechIcon key={lang} name={lang} />
                            ))}
                        </div>
                    )}

                    {/* Teammates Capsule Row */}
                    {project.team && (
                        <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4 select-none shrink-0 relative z-20">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-extrabold font-secondary flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faUsers} className="size-3" />
                                {t_projects("teammates", { defaultValue: "Teammates" })}
                            </span>
                            <div className="flex flex-col gap-2">
                                {project.team.map((group: any) => (
                                    <div key={group.role} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                                        <span className="text-gray-400 capitalize font-medium">{t_team(group.role, { count: group.members.length })}:</span>
                                        <div className="flex flex-wrap items-center gap-x-1">
                                            {group.members.map((member: any, mIdx: number) => (
                                                <span key={member.name} className="inline-flex items-center">
                                                    <Link 
                                                        href={member.href} 
                                                        target="_blank" 
                                                        className="text-accent-blue font-bold hover:underline relative z-30 cursor-pointer"
                                                    >
                                                        {member.name}
                                                    </Link>
                                                    {mIdx < group.members.length - 1 && <span className="text-gray-500 mr-1">,</span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
}

export default function GalleryClient() {
    const t = useTranslations("gallery");
    const t_projects = useTranslations("gallery.projects");
    const t_repos = useTranslations("gallery.repositories");

    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [showArchives, setShowArchives] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
    const [selectedProjectType, setSelectedProjectType] = useState<"all" | "personal" | "academic">("all");

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const repos = await retrieveRepositories();
                setRepositories(repos);
            } catch (err) {
                console.error("Failed to load GitHub repos", err);
            }
        };
        fetchRepos();
    }, []);

    // Filter active (non-archived) repositories
    const activeRepos = repositories.filter(repo => {
        if (repo.fork || repo.name === repo.owner.login) return false;
        if (repo.archived) return false;
        if (selectedLanguage !== "All") {
            if (!repo.language || repo.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
        }
        return true;
    }).sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Filter archived repositories
    const archivedRepos = repositories.filter(repo => {
        if (repo.fork || repo.name === repo.owner.login) return false;
        if (!repo.archived) return false;
        if (selectedLanguage !== "All") {
            if (!repo.language || repo.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
        }
        return true;
    }).sort((a, b) => b.stargazers_count - a.stargazers_count);

    const languages = ["All", "Java", "TypeScript", "JavaScript", "C++", "PHP"];

    const filteredProjects = PROJECTS.filter(project => {
        if (selectedProjectType !== "all" && project.type !== selectedProjectType) return false;
        return true;
    });

    const renderCard = (repo: Repository) => {
        const isArchived = repo.archived;
        return (
            <motion.div
                layout
                key={repo.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className={`group relative bg-secondary/30 rounded-3xl p-7 border flex flex-col justify-between gap-6 transition-[border-color,box-shadow,background-color] duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.5)] ${isArchived ? 'border-accent-teal/20 hover:border-accent-teal/50' : 'border-white/8 hover:border-accent-blue/45'} interactive-card`}
                data-cursor-text="CODE"
            >
                <div className="flex flex-col gap-4">
                    {/* Repo Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faFolderOpen} className={`size-4 ${isArchived ? 'text-accent-teal' : 'text-accent-blue'}`} />
                            <Link href={repo.html_url} target="_blank" className="font-primary text-base font-bold text-white group-hover:text-accent-blue transition-colors leading-tight cursor-pointer after:absolute after:inset-0 after:z-10 after:rounded-3xl">
                                {repo.name}
                            </Link>
                        </div>
                    </div>

                    {/* Stars and Forks counters */}
                    {(repo.stargazers_count > 0 || repo.forks_count > 0) && (
                        <div className="flex gap-4 select-none">
                            {repo.stargazers_count > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <FontAwesomeIcon icon={faStar} className="size-3.5 text-yellow-500 animate-pulse" />
                                    <span className="font-bold text-white">{repo.stargazers_count}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{t_repos(`properties.stars`, { count: repo.stargazers_count }).replace(/[0-9]/g, '').trim()}</span>
                                </div>
                            )}
                            {repo.forks_count > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <FontAwesomeIcon icon={faCodeFork} className="size-3.5 text-gray-500" />
                                    <span className="font-bold text-white">{repo.forks_count}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{t_repos(`properties.forks`, { count: repo.forks_count }).replace(/[0-9]/g, '').trim()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {repo.description && (
                        <p className="font-secondary text-xs text-gray-400 leading-relaxed max-w-sm line-clamp-3">
                            {repo.description}
                        </p>
                    )}

                    {repo.topics?.length > 0 && (
                        <ul className="flex flex-wrap gap-2 min-w-0">
                            {repo.topics.slice(0, 5).map(topic => (
                                <li
                                    key={topic}
                                    className="max-w-full rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 font-secondary text-xs leading-relaxed text-blue-200 break-words"
                                >
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Language and Status Pill */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    {repo.language ? (
                        <span className={`text-[10px] uppercase tracking-widest font-extrabold font-secondary ${isArchived ? 'text-accent-teal' : 'text-accent-blue'}`}>
                            {repo.language}
                        </span>
                    ) : (
                        <span />
                    )}
                    
                    {isArchived ? (
                        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-extrabold font-secondary">
                            {t("status.archived", { defaultValue: "Archived" })}
                        </span>
                    ) : repo.is_template ? (
                        <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-extrabold font-secondary">
                            {t("status.template", { defaultValue: "Template" })}
                        </span>
                    ) : (
                        <span className="bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-extrabold font-secondary">
                            {t("status.active", { defaultValue: "Active" })}
                        </span>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <Article title={t("title")} description={t("description")} pill={t("title")}>
            <div className="w-full py-10 max-w-7xl mx-auto px-8 flex flex-col gap-24">
                
                {/* PART 1: PREMIUM BENTO GRID PROJECTS SECTION */}
                <div className="flex flex-col gap-8 w-full mt-4">
                    <div className="flex flex-col gap-2 text-center lg:text-left select-none">
                        <span className="text-[10px] uppercase tracking-widest text-accent-blue font-extrabold font-secondary">{t("featured_works")}</span>
                        <h2 className="font-primary text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">{t_projects("title")}</h2>
                        <p className="font-secondary text-sm md:text-base text-gray-400 mt-2">{t_projects("description")}</p>
                    </div>

                    {/* Project Type Filter Selector */}
                    <div className="flex justify-center lg:justify-start gap-2 select-none border-b border-white/5 pb-6">
                        {(["all", "personal", "academic"] as const).map(projType => {
                            const isSelected = selectedProjectType === projType;
                            return (
                                <button
                                    key={projType}
                                    onClick={() => setSelectedProjectType(projType)}
                                    className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border cursor-pointer ${isSelected ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(78,168,255,0.15)]' : 'bg-secondary/40 border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                                >
                                    {t_projects(`filters.${projType}`)}
                                </button>
                            );
                        })}
                    </div>

                    <motion.div 
                        layout 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map(project => {
                                const cardVariants = {
                                    hidden: { opacity: 0, y: 25, scale: 0.97 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: { type: "spring", stiffness: 90, damping: 15 }
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 15,
                                        scale: 0.95,
                                        transition: { duration: 0.2 }
                                    }
                                } as const;

                                return (
                                    <motion.div
                                        layout
                                        key={project.key}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={cardVariants}
                                        className="h-full flex"
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* PART 2: LIVE GITHUB REPOSITORIES BOARD */}
                <div className="flex flex-col gap-8 w-full border-t border-white/5 pt-16">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <span className="text-[10px] uppercase tracking-widest text-accent-teal font-extrabold font-secondary">{t("open_source")}</span>
                            <h2 className="font-primary text-3xl font-extrabold text-white tracking-tight mt-1">{t_repos("title")}</h2>
                            <p className="font-secondary text-sm text-gray-400 mt-2 max-w-xl">{t_repos("description")}</p>
                        </div>
                    </div>

                    {/* Language Filter Panel */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start select-none border-b border-white/5 pb-6">
                        {languages.map(lang => {
                            const isSelected = selectedLanguage === lang;
                            return (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border cursor-pointer ${isSelected ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(78,168,255,0.15)]' : 'bg-secondary/40 border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                                >
                                    {lang === "All" ? t_projects("filters.all") : lang}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Repositories Grid Layout */}
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {activeRepos.map(repo => renderCard(repo))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Active Empty State */}
                    {activeRepos.length === 0 && (
                        <div className="w-full text-center py-16 bg-secondary/10 border border-white/5 rounded-3xl select-none">
                            <FontAwesomeIcon icon={faFilter} className="size-8 text-gray-600 mb-4 animate-bounce" />
                            <h3 className="font-primary text-lg font-bold text-white uppercase tracking-wider">{t("no_repos")}</h3>
                            <p className="font-secondary text-sm text-gray-500 mt-1 max-w-sm mx-auto">{t("no_repos_desc")}</p>
                        </div>
                    )}

                    {/* Load/Toggle Archives Button */}
                    {archivedRepos.length > 0 && (
                        <div className="flex justify-center w-full mt-10 select-none">
                            <button
                                onClick={() => setShowArchives(!showArchives)}
                                className="bg-secondary/40 border border-accent-teal/30 text-accent-teal hover:bg-accent-teal hover:text-black shadow-[0_0_15px_rgba(98,226,213,0.05)] hover:shadow-[0_0_25px_rgba(98,226,213,0.25)] transition-all duration-500 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer active:scale-95 flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faArchive} className="size-3.5" />
                                {showArchives ? t_repos("view_archives.hide") : t_repos("view_archives.show")}
                            </button>
                        </div>
                    )}

                    {/* Archived Repos Panel (When Open) */}
                    <AnimatePresence>
                        {showArchives && archivedRepos.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex flex-col gap-8 overflow-hidden mt-6"
                            >
                                {/* Wavy Separator with neon lighting */}
                                <div className="w-full flex flex-col items-center py-10 relative select-none">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-teal/15 to-transparent -translate-y-1/2" />
                                    <svg className="w-full h-10 text-accent-teal/30 stroke-current fill-none relative z-10 animate-pulse" viewBox="0 0 1200 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                        <path 
                                            d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20" 
                                            strokeWidth="2" 
                                            strokeLinecap="round"
                                        />
                                        <path 
                                            d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20" 
                                            strokeWidth="5" 
                                            strokeLinecap="round"
                                            className="opacity-15 blur-[2px]"
                                        />
                                    </svg>
                                </div>

                                {/* Archived Grid */}
                                <motion.div 
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4"
                                >
                                    {archivedRepos.map(repo => renderCard(repo))}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            </div>
        </Article>
    );
}

// Portfolio datasets shared by the homepage sections and the generated CV (/cv).
// Kept free of "use client" so server code (the CV route) can import them too:
// adding an entry here updates both the site and the next CV download.

import { faBolt, faSliders, faPerson, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    FABIEN_GRAYSSAGUEL, LEO_RIVIERES,
    ANTOINE_MAENDLY, ELIE_BUSSOD, DANIEL_DOSH, VIONA_CUFO,
    JEAN_LUC_FALCONE, CHRISTOPHE_CHARPILLOZ, DELPHINE_COURVOISIER, ALEXANDRE_RIEDO
} from "@/components/utils/Team";

export const CONTACT = {
    mail: "contact@agonkolgeci.com",
    github: "https://github.com/agonkolgeci",
    linkedin: "https://www.linkedin.com/in/agon-kolgeci/",
    location: "Geneva, Switzerland"
} as const;

// Spoken languages; level is "native" or a CEFR level (A1 to C2).
export const SPOKEN_LANGUAGES = [
    { key: "french", level: "native" },
    { key: "albanian", level: "native" },
    { key: "english", level: "B2" }
] as const;

export interface School {
    key: string;
    url: string;
    // Per-language page when the school has one; the CV uses it and falls back to `url`.
    localizedUrls?: { fr?: string; en?: string };
    image?: string;
    glow: "lime" | "orange";
}

// Academic Milestones Data (Most Recent First)
export const SCHOOLS: School[] = [
    { key: "master", url: "https://www.unige.ch/bachelor-master/en/masters/computer-science", localizedUrls: { fr: "https://www.unige.ch/bachelor-master/masters/sciences-informatiques" }, image: "/education/unige.svg", glow: "lime" },
    { key: "bachelor", url: "https://www.unige.ch/bachelor-master/bachelors/sciences-informatiques", localizedUrls: { en: "https://cui.unige.ch/en/formations/bachelors/" }, image: "/education/unige.svg", glow: "orange" },
    { key: "stael", url: "https://madame-de-stael.ent.auvergnerhonealpes.fr/", glow: "lime" }
];

export interface Experience {
    readonly key: string;
    readonly image: string;
    readonly tags: readonly string[];
    readonly tasks: readonly string[];
    readonly languages: readonly string[];
    readonly links?: readonly { readonly name: string; readonly href: string }[];
}

export const PROFESSIONAL_EXPERIENCES: readonly Experience[] = [
    {
        key: "unige_are",
        image: "/experiences/unige.jpg",
        tags: ["are"],
        tasks: ["1", "2"],
        languages: []
    },
    {
        key: "world-heberg",
        image: "/experiences/world-heberg.png",
        tags: ["volunteering"],
        tasks: ["1", "2"],
        languages: ["Java", "JavaScript"]
    },
    {
        key: "buro_plus",
        image: "/experiences/buroplus.webp",
        links: [
            { name: "Website", href: "https://www.buroplus.com/" }
        ],
        tags: ["internship"],
        tasks: ["1", "2", "3", "4"],
        languages: []
    }
];

// All 32 GitHub core technologies and tools divided into 3 scroll steps (10 in step 1, 9 in step 2, 13 in step 3)
export const TECH_CONSTELLATION = [
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

export const SOFT_SKILLS_DATA = [
    {
        key: "motivation" as const,
        color: "#4ea8ff",
        icon: faBolt
    },
    {
        key: "adaptation" as const,
        color: "#62e2d5",
        icon: faSliders
    },
    {
        key: "autonomy" as const,
        color: "#a855f7",
        icon: faPerson
    },
    {
        key: "team_work" as const,
        color: "#38bdf8",
        icon: faPeopleGroup
    }
];

// Projects Dataset
export const PROJECTS = [
    {
        key: "project-family",
        type: "personal",
        image: "/gallery/project-family.webp",
        links: [
            { name: "Website", href: "https://projectfamily.fr/" }
        ],
        tags: ["lead-developer"],
        languages: ["Java", "JavaScript", "Electron", "Spigot", "Fabric", "MySQL"],
        team: [
            { role: "founders", members: [FABIEN_GRAYSSAGUEL] }
        ]
    },
    {
        key: "yadbna",
        type: "personal",
        image: "/gallery/yadbna.png",
        links: [
            { name: "Website", href: "https://yadbna.xyz/" }
        ],
        tags: ["lead-developer"],
        languages: ["Java", "JavaScript", "Discord API"],
        team: [
            { role: "thanks", members: [FABIEN_GRAYSSAGUEL] }
        ]
    },
    {
        key: "unige-events",
        type: "academic",
        image: "/gallery/unige-events.jpg",
        links: [
            { name: "Website", href: "https://pinfo6.p-info.net/" }
        ],
        tags: ["tech-lead", "devops", "unige"],
        languages: ["TypeScript", "React", "Java", "Quarkus", "Kong", "Kubernetes"],
        team: [
            { role: "collaborators", members: [ANTOINE_MAENDLY, DANIEL_DOSH, ELIE_BUSSOD, VIONA_CUFO] }
        ]
    },
    {
        key: "redcap-swisscom-module",
        type: "academic",
        image: "/experiences/redcap.webp",
        links: [
            { name: "Website", href: "https://github.com/vanderbilt-redcap/external-module-framework-docs" }
        ],
        tags: ["unige"],
        languages: ["PHP", "Docker", "MySQL"],
        team: [
            { role: "collaborators", members: [ANTOINE_MAENDLY, ELIE_BUSSOD] },
            { role: "supervisors", members: [JEAN_LUC_FALCONE, CHRISTOPHE_CHARPILLOZ] },
            { role: "clients", members: [DELPHINE_COURVOISIER] }
        ]
    },
    {
        key: "nexus",
        type: "personal",
        image: "/gallery/nexus.webp",
        links: [
            { name: "GitHub", icon: faGithub, href: "https://github.com/agonkolgeci/Nexus" }
        ],
        tags: ["founder", "lead-developer"],
        languages: ["Java"],
        team: [
            { role: "thanks", members: [FABIEN_GRAYSSAGUEL] }
        ]
    },
    {
        key: "swerc2024",
        type: "academic",
        image: "/experiences/swerc2024.webp",
        links: [
            { name: "Website", href: "https://swerc.eu/2024" }
        ],
        tags: ["unige"],
        languages: ["C++"],
        team: [
            { role: "collaborators", members: [ANTOINE_MAENDLY, ALEXANDRE_RIEDO] }
        ]
    },
    {
        key: "stranger-hide",
        type: "personal",
        image: "/gallery/strangerhide.webp",
        links: [
            { name: "GitHub", icon: faGithub, href: "https://github.com/StrangerHide/" }
        ],
        tags: ["lead-developer"],
        languages: ["Java"],
        team: [
            { role: "founders", members: [LEO_RIVIERES, FABIEN_GRAYSSAGUEL] }
        ]
    },
    {
        key: "berkasia",
        type: "personal",
        image: "/gallery/berkasia.webp",
        links: [
            { name: "GitHub", icon: faGithub, href: "https://github.com/Berkasia/" }
        ],
        tags: ["founder", "lead-developer"],
        languages: ["Java", "MySQL"]
    }
] as const;

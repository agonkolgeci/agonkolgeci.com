import type { CvData } from "./CvDocument";
import { PROFESSIONAL_EXPERIENCES, PROJECTS, SCHOOLS } from "@/data/portfolio";

// A curated one-page selection, independent of any event or employer.
export function compactCv(data: CvData): CvData {
    const fr = data.locale === "fr";
    const projects = [
        {
            key: "unige-events",
            date: fr ? "févr. - mai 2026" : "Feb - May 2026",
            roles: fr ? "Leader technique & DevOps · Projet universitaire" : "Tech lead & DevOps · University project",
            description: fr
                ? "Avec quatre autres étudiants, j'ai développé une plateforme pour publier les événements du campus et gérer les inscriptions. J'y ai assuré le rôle de leader technique et DevOps, sur une architecture en microservices."
                : "With four fellow students, I built a platform for campus events and registrations. I worked as tech lead and DevOps on its microservices architecture.",
        },
        {
            key: "redcap-swisscom-module",
            date: fr ? "févr. - mai 2025" : "Feb - May 2025",
            roles: fr ? "Projet de semestre · HUG / UNIGE" : "Semester project · HUG / UNIGE",
            description: fr
                ? "J'ai contribué à un module REDCap qui envoie des SMS via l'API Swisscom. Un projet pour les HUG, avec des contraintes concrètes : coûts d'envoi, suivi des accusés de réception et intégration à un outil existant."
                : "I contributed to a REDCap module that sends SMS through the Swisscom API. Built for Geneva University Hospitals, it addressed sending costs, delivery tracking and integration with an existing tool.",
        },
        {
            key: "swerc2024",
            date: fr ? "nov. - déc. 2024" : "Nov - Dec 2024",
            roles: fr ? "Concours d'algorithmique · Équipe UNIGE" : "Programming contest · UNIGE team",
            description: fr
                ? "Ma première compétition d'algorithmique : cinq heures, trois étudiants et des problèmes à résoudre en C++. Une expérience de réflexion en équipe, de débogage et de programmation sous pression."
                : "My first programming contest: five hours, three students and algorithmic problems to solve in C++. An exercise in teamwork, debugging and programming under pressure.",
        },
        {
            key: "project-family",
            date: fr ? "depuis 2021" : "since 2021",
            roles: fr ? "Développeur principal · Projet personnel" : "Lead developer · Personal project",
            description: fr
                ? "Je développe un serveur Minecraft moddé et son lanceur pour une communauté active. Ce projet au long cours me permet de faire évoluer des fonctionnalités et de travailler sur les liens entre jeu, outils et données."
                : "I develop a modded Minecraft server and its launcher for an active community. This long-running project lets me build new features and connect the game, its tools and its data.",
        },
    ];

    return {
        ...data,
        role: fr ? "Développeur logiciel" : "Software developer",
        profile: fr
            ? "J'ai commencé à programmer en autodidacte en 2018, en créant autour de Minecraft. De fil en aiguille, je suis passé de Java aux applications web, puis aux projets en équipe à l'UNIGE.\n\nEn parallèle de mon Master à l'UNIGE, je développe mes propres projets et encadre des étudiants en programmation. Je souhaite aujourd'hui mettre cette expérience à profit au sein d'une équipe de développement."
            : "I started teaching myself to code in 2018, building things around Minecraft. From Java, I moved into web applications and then team projects at UNIGE.\n\nNow studying for my Master's, I still work on my own projects. I'd like to join a team, learn from the people around me and contribute to software people use every day.",
        education: ["master", "bachelor"].map(key => {
            const school = data.education[SCHOOLS.findIndex(item => item.key === key)];
            return {
                ...school,
                title: fr
                    ? `${key === "master" ? "Master" : "Bachelor"} en Sciences Informatiques`
                    : `${key === "master" ? "MSc" : "BSc"} in Computer Science`,
                date: key === "master" ? (fr ? "2026 - en cours" : "2026 - present") : "2023 - 2026",
                description: key === "master"
                    ? (fr ? "Génie logiciel, systèmes distribués, intelligence artificielle." : "Software engineering, distributed systems, artificial intelligence.")
                    : (fr ? "Algorithmique, génie logiciel, systèmes et sécurité." : "Algorithms, software engineering, systems and security."),
            };
        }),
        experiences: [{
            ...data.experiences[PROFESSIONAL_EXPERIENCES.findIndex(item => item.key === "unige_are")],
            role: fr ? "Auxiliaire de recherche et d'enseignement" : "Teaching and research assistant",
            organisation: fr ? "Université de Genève · ARE" : "University of Geneva · ARE",
            date: fr ? "sept. - déc. 2026" : "Sep - Dec 2026",
            description: fr
                ? "J'accompagne les étudiants en séances d'exercices et de travaux pratiques, dans deux cours aux publics très différents."
                : "I support students during exercises and lab sessions in two courses with very different audiences.",
            tasks: fr ? [
                "Systèmes concurrents et distribués : étudiants de 3e année en informatique.",
                "Programmation pour biologistes : premiers pas en programmation en 2e année.",
            ] : [
                "Concurrent and Distributed Systems: third-year computer science students.",
                "Programming for Biologists: second-year students learning to code.",
            ],
        }],
        projects: projects.map(({ key, ...copy }) => {
            const project = data.projects[PROJECTS.findIndex(item => item.key === key)];
            return {
                ...project,
                ...copy,
                href: key === "redcap-swisscom-module" ? undefined : project.href,
                technologies: key === "project-family" ? ["Java", "JavaScript", "Electron", "MySQL"] : project.technologies,
            };
        }),
        skills: [
            { title: fr ? "Langages" : "Languages", items: ["Java", "Python", "C++", "TypeScript", "JavaScript", "PHP"] },
            { title: fr ? "Web & données" : "Web & data", items: ["React", "Next.js", "Quarkus", "MySQL", "Redis"] },
            { title: fr ? "Infrastructure & outils" : "Infrastructure & tools", items: ["Git", "Linux", "Docker", "Kubernetes", "Jenkins"] },
        ],
        labels: { ...data.labels, profile: fr ? "Mon parcours" : "My story", projects: fr ? "Projets & concours" : "Projects & competitions" },
    };
}

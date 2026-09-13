import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import type { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createTranslator } from "next-intl";

import CvDocument, { CvData } from "@/lib/cv/CvDocument";
import { CONTACT, PROFESSIONAL_EXPERIENCES, PROJECTS, SCHOOLS, SPOKEN_LANGUAGES, TECH_CONSTELLATION } from "@/data/portfolio";
import { Locale, locales } from "@/i18n/locales";
import { getUserLocale } from "@/services/locale";
import { siteUrl } from "@/lib/metadata";

// react-pdf relies on Node APIs (fs, zlib) to lay out and compress the document.
export const runtime = "nodejs";

// Friendlier names on paper than the icon identifiers used on the site.
const TECH_LABELS: Record<string, string> = { Node: "Node.js", NextJS: "Next.js" };
const techLabel = (name: string) => TECH_LABELS[name] ?? name;

// Shown on the site, left off the CV: editors and Q&A sites aren't skills a recruiter looks for.
const CV_HIDDEN_TECH = ["VSCode", "IntelliJ IDEA", "StackOverflow"];

async function resolveLocale(request: NextRequest): Promise<Locale> {
    // ?lang=fr|en forces a language; otherwise follow the visitor's site locale.
    const requested = request.nextUrl.searchParams.get("lang");
    if (requested && locales.includes(requested as Locale)) return requested as Locale;

    const userLocale = await getUserLocale();
    return locales.includes(userLocale as Locale) ? userLocale as Locale : "en";
}

async function buildCvData(locale: Locale): Promise<CvData> {
    // A standalone translator: the request config (i18n/request.ts) always loads
    // the cookie locale's messages, which would ignore ?lang=.
    const messages = (await import(`@/messages/${locale}.json`)).default;
    const t = createTranslator({ locale, messages });
    const cv = createTranslator({ locale, messages, namespace: "cv" });

    // Entries may carry a short CV-specific "summary"; new ones without it fall back to the site description.
    const summaryOr = (path: string) => t.has(`${path}.summary`) ? t(`${path}.summary`) : t(`${path}.description`);

    return {
        locale,
        name: t("global.title"),
        role: t("global.role"),
        profile: cv("profile_text"),
        contact: {
            mail: CONTACT.mail,
            // Private details only come from the local .env (git-ignored): in production
            // the CV has no phone number and shows the city instead of the postal address.
            phone: process.env.CV_PHONE?.trim() || undefined,
            location: process.env.CV_ADDRESS?.trim() || cv("location"),
            github: CONTACT.github,
            linkedin: CONTACT.linkedin,
            website: siteUrl
        },
        education: SCHOOLS.map(school => {
            const path = `education.school_career.schools.${school.key}`;
            return {
                title: t(`${path}.title`),
                institution: t(`${path}.institution`),
                date: t(`${path}.date`),
                description: summaryOr(path),
                href: school.localizedUrls?.[locale] ?? school.url
            };
        }),
        experiences: PROFESSIONAL_EXPERIENCES.map(exp => {
            const path = `experiences.professional_experiences.contents.${exp.key}`;
            return {
                role: t(`${path}.role`),
                organisation: [t(`${path}.title`), ...exp.tags.map(tag => t(`tags.${tag}`))].join(", "),
                date: t(`${path}.date`),
                description: summaryOr(path),
                tasks: exp.tasks.map(task => t(`${path}.tasks.${task}`)),
                href: exp.links?.[0]?.href
            };
        }),
        projects: PROJECTS.map(project => {
            const path = `gallery.projects.contents.${project.key}`;
            return {
                title: t(`${path}.title`),
                date: t(`${path}.date`),
                roles: project.tags.map(tag => t(`tags.${tag}`)).join(", "),
                description: summaryOr(path),
                technologies: project.languages.map(techLabel),
                href: project.links[0]?.href
            };
        }),
        // Same three rows as the site's tech constellation.
        skills: ([["languages", 1], ["stack", 2], ["tools", 3]] as const).map(([label, step]) => ({
            title: cv(label),
            items: TECH_CONSTELLATION
                .filter(item => item.step === step && !CV_HIDDEN_TECH.includes(item.name))
                .map(item => techLabel(item.name))
        })),
        languages: SPOKEN_LANGUAGES.map(language => ({
            name: cv(`language_names.${language.key}`),
            level: language.level === "native" ? cv("native") : language.level
        })),
        labels: {
            title: cv("title"),
            profile: cv("profile"),
            contact: cv("contact"),
            education: cv("education"),
            experiences: cv("experiences"),
            projects: cv("projects"),
            skills: cv("skills"),
            languages: cv("spoken_languages")
        }
    };
}

export async function GET(request: NextRequest) {
    const locale = await resolveLocale(request);
    const data = await buildCvData(locale);
    // Optional photo: drop it at public/cv/photo.jpg and it shows up at the top of the sidebar.
    data.photo = await readFile(path.join(process.cwd(), "public/cv/photo.jpg")).catch(() => undefined);
    // CvDocument renders a <Document> root; react-pdf's typing only accepts the element itself.
    const pdf = await renderToBuffer(createElement(CvDocument, { data }) as unknown as Parameters<typeof renderToBuffer>[0]);

    return new Response(new Uint8Array(pdf), {
        headers: {
            "Content-Type": "application/pdf",
            // inline: the browser displays the PDF. The filename is the default for "Save as", and
            // viewers that append a file name to the tab title show this instead of the URL's "cv".
            "Content-Disposition": `inline; filename="${data.name.replace(/\s+/g, "-")}-CV-${locale.toUpperCase()}.pdf"`,
            "Cache-Control": "no-store"
        }
    });
}

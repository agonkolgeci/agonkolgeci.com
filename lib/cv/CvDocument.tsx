import { Document, Font, Image, Link, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faGlobe, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

// No automatic hyphenation: words are kept whole instead of being split with dashes.
Font.registerHyphenationCallback(word => [word]);

// Plain, already-translated strings: the route resolves every message so this
// component only deals with layout.
export type CvData = {
    locale: string;
    name: string;
    role: string;
    profile: string;
    photo?: Buffer;
    contact: { mail: string; phone?: string; location: string; github: string; linkedin: string; website: string };
    education: { title: string; institution: string; date: string; description: string; href?: string }[];
    experiences: { role: string; organisation: string; date: string; description: string; tasks: string[]; href?: string }[];
    projects: { title: string; date: string; roles: string; description: string; technologies: string[]; href?: string }[];
    skills: { title: string; items: string[] }[];
    languages: { name: string; level: string }[];
    labels: { title: string; profile: string; contact: string; education: string; experiences: string; projects: string; skills: string; languages: string };
};

const A4_HEIGHT = 841.89;
const A4_WIDTH = 595.28;
const PAGE_PADDING = 32;
const SIDEBAR_WIDTH = 178;
const PHOTO_SIZE = SIDEBAR_WIDTH - 40;

// The portfolio's palette: navy background and the blue accent, darkened on white for contrast.
const colors = {
    ink: "#0b1019",
    text: "#2b313b",
    muted: "#6b7280",
    rule: "#dfe3ea",
    accent: "#2c7fd6",
    sidebar: "#0b1019",
    sidebarText: "#d3d8e0",
    sidebarMuted: "#8b95a7",
    sidebarAccent: "#4ea8ff"
};

const styles = StyleSheet.create({
    page: { paddingVertical: PAGE_PADDING, fontFamily: "Helvetica", fontSize: 8.5, color: colors.text, lineHeight: 1.4 },
    sidebarBackground: { position: "absolute", top: 0, bottom: 0, left: 0, width: SIDEBAR_WIDTH, backgroundColor: colors.sidebar },
    columns: { flexDirection: "row" },

    sidebar: { width: SIDEBAR_WIDTH, paddingHorizontal: 20, color: colors.sidebarText },
    // Square crop drawn as a circle; the vertical offset keeps the face centred in a portrait shot.
    photo: { width: PHOTO_SIZE, height: PHOTO_SIZE, objectFit: "cover", objectPosition: "50% 30%", borderRadius: PHOTO_SIZE / 2, marginBottom: 14 },
    name: { fontFamily: "Helvetica-Bold", fontSize: 17, color: "#ffffff", lineHeight: 1.15 },
    role: { fontSize: 9, color: colors.sidebarAccent, marginTop: 3 },
    sidebarSection: { marginTop: 18 },
    sidebarTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#ffffff", marginBottom: 5 },
    sidebarLine: { flex: 1, fontSize: 8, color: colors.sidebarText, textDecoration: "none" },
    // Top-aligned so the icon sits on the first line when a value (the postal address) wraps.
    contactRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
    contactIcon: { width: 9, height: 9, marginRight: 7, marginTop: 1.5 },
    skillGroup: { marginBottom: 7 },
    skillLabel: { fontSize: 7.5, color: colors.sidebarMuted, marginBottom: 1 },
    skillList: { fontSize: 8, color: colors.sidebarText },
    languageRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    languageLevel: { fontSize: 8, color: colors.sidebarMuted },

    main: { flex: 1, paddingLeft: 26, paddingRight: PAGE_PADDING },
    section: { marginBottom: 16 },
    sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11.5, color: colors.ink, paddingBottom: 3, marginBottom: 7, borderBottomWidth: 0.75, borderBottomColor: colors.rule },
    entry: { marginBottom: 16 },
    entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 9, color: colors.ink, flex: 1, paddingRight: 10 },
    entryDate: { fontSize: 8, color: colors.muted },
    entrySubtitle: { fontSize: 8.5, color: colors.accent, marginTop: 0.5 },
    paragraph: { marginTop: 2 },
    bullet: { flexDirection: "row", marginTop: 1.5 },
    bulletDot: { width: 9, color: colors.muted },
    bulletText: { flex: 1 },
    technologies: { fontSize: 7.5, color: colors.muted, marginTop: 2 },
    link: { textDecoration: "none" },

    timelineEntry: { flexDirection: "row" },
    timelineGutter: { width: 14, position: "relative" },
    timelineDot: { position: "absolute", left: 0, top: 3, width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.sidebarAccent, borderWidth: 1.5, borderColor: "#d6e9ff" },
    // Extends past the entry's bottom margin so it meets the next dot.
    timelineRail: { position: "absolute", left: 3, top: 11, bottom: -3, width: 1, backgroundColor: colors.rule },
    timelineBody: { flex: 1 },

    pageNumber: { position: "absolute", top: A4_HEIGHT - 22, left: SIDEBAR_WIDTH, width: A4_WIDTH - SIDEBAR_WIDTH - PAGE_PADDING, textAlign: "right", fontSize: 7, color: colors.muted }
});

// Entries never split across pages, and the heading travels with the first
// entry so it can't be stranded alone at the bottom of a page.
function Section<T>({ title, items, render }: { title: string; items: T[]; render: (item: T, index: number, isLast: boolean) => React.ReactNode }) {
    const [first, ...rest] = items;

    return (
        <View style={styles.section}>
            <View wrap={false}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {first !== undefined && render(first, 0, items.length === 1)}
            </View>
            {rest.map((item, index) => (
                <View key={index} wrap={false}>{render(item, index + 1, index + 2 === items.length)}</View>
            ))}
        </View>
    );
}

// Dot on a vertical rail; the rail runs down to the next entry's dot and stops after the last one.
function TimelineEntry({ isLast, children }: { isLast: boolean; children: React.ReactNode }) {
    return (
        <View style={styles.timelineEntry}>
            <View style={styles.timelineGutter}>
                <View style={styles.timelineDot} />
                {!isLast && <View style={styles.timelineRail} />}
            </View>
            <View style={styles.timelineBody}>{children}</View>
        </View>
    );
}

function EntryHeader({ title, date, href }: { title: string; date: string; href?: string }) {
    return (
        <View style={styles.entryHeader}>
            {href
                ? <Link src={href} style={[styles.entryTitle, styles.link]}>{title}</Link>
                : <Text style={styles.entryTitle}>{title}</Text>}
            <Text style={styles.entryDate}>{date}</Text>
        </View>
    );
}

// Draws a FontAwesome icon as vector paths, so it stays sharp when printed.
function Icon({ icon }: { icon: IconDefinition }) {
    const [width, height, , , path] = icon.icon;
    const paths = Array.isArray(path) ? path : [path];

    return (
        <Svg viewBox={`0 0 ${width} ${height}`} style={styles.contactIcon}>
            {paths.map((d, index) => <Path key={index} d={d} fill={colors.sidebarAccent} />)}
        </Svg>
    );
}

function ContactRow({ icon, value, href }: { icon: IconDefinition; value: string; href?: string }) {
    return (
        <View style={styles.contactRow}>
            <Icon icon={icon} />
            {href
                ? <Link src={href} style={styles.sidebarLine}>{value}</Link>
                : <Text style={styles.sidebarLine}>{value}</Text>}
        </View>
    );
}

// Strips the protocol so links read cleanly on paper.
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function CvDocument({ data }: { data: CvData }) {
    const { labels, contact } = data;

    return (
        <Document title={`${data.name} - ${labels.title}`} author={data.name} subject={data.role} language={data.locale}>
            <Page size="A4" style={styles.page}>
                <View fixed style={styles.sidebarBackground} />

                <View style={styles.columns}>
                    <View style={styles.sidebar}>
                        {/* react-pdf's Image has no alt prop; the jsx-a11y rule targets HTML <img>. */}
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        {data.photo && <Image src={data.photo} style={styles.photo} />}
                        <Text style={styles.name}>{data.name}</Text>
                        <Text style={styles.role}>{data.role}</Text>

                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>{labels.contact}</Text>
                            <ContactRow icon={faLocationDot} value={contact.location} />
                            {contact.phone && (
                                <ContactRow icon={faPhone} value={contact.phone} href={`tel:${contact.phone.replace(/\s+/g, "")}`} />
                            )}
                            <ContactRow icon={faEnvelope} value={contact.mail} href={`mailto:${contact.mail}`} />
                            <ContactRow icon={faGlobe} value={displayUrl(contact.website)} href={contact.website} />
                            <ContactRow icon={faGithub} value={displayUrl(contact.github)} href={contact.github} />
                            <ContactRow icon={faLinkedin} value={displayUrl(contact.linkedin)} href={contact.linkedin} />
                        </View>

                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>{labels.skills}</Text>
                            {data.skills.map(group => (
                                <View key={group.title} style={styles.skillGroup}>
                                    <Text style={styles.skillLabel}>{group.title}</Text>
                                    <Text style={styles.skillList}>{group.items.join(", ")}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>{labels.languages}</Text>
                            {data.languages.map(language => (
                                <View key={language.name} style={styles.languageRow}>
                                    <Text style={styles.skillList}>{language.name}</Text>
                                    <Text style={styles.languageLevel}>{language.level}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.main}>
                        <Section title={labels.profile} items={[data.profile]} render={profile => (
                            <Text>{profile}</Text>
                        )} />

                        <Section title={labels.education} items={data.education} render={(school, _index, isLast) => (
                            <TimelineEntry isLast={isLast}>
                                <View style={styles.entry}>
                                    <EntryHeader title={school.title} date={school.date} href={school.href} />
                                    <Text style={styles.entrySubtitle}>{school.institution}</Text>
                                    <Text style={styles.paragraph}>{school.description}</Text>
                                </View>
                            </TimelineEntry>
                        )} />

                        <Section title={labels.experiences} items={data.experiences} render={exp => (
                            <View style={styles.entry}>
                                <EntryHeader title={exp.role} date={exp.date} href={exp.href} />
                                <Text style={styles.entrySubtitle}>{exp.organisation}</Text>
                                <Text style={styles.paragraph}>{exp.description}</Text>
                                {exp.tasks.map(task => (
                                    <View key={task} style={styles.bullet}>
                                        <Text style={styles.bulletDot}>•</Text>
                                        <Text style={styles.bulletText}>{task}</Text>
                                    </View>
                                ))}
                            </View>
                        )} />

                        <Section title={labels.projects} items={data.projects} render={project => (
                            <View style={styles.entry}>
                                <EntryHeader title={project.title} date={project.date} href={project.href} />
                                {project.roles !== "" && <Text style={styles.entrySubtitle}>{project.roles}</Text>}
                                <Text style={styles.paragraph}>{project.description}</Text>
                                {project.technologies.length > 0 && (
                                    <Text style={styles.technologies}>{project.technologies.join(", ")}</Text>
                                )}
                            </View>
                        )} />
                    </View>
                </View>

                <Text fixed style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </Page>
        </Document>
    );
}

import path from "node:path";
import { Document, Font, Image, Link, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faGlobe, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

// Bundle the site's body typeface so PDF generation works without a network request.
Font.register({ family: "Poppins", fonts: [
    { src: path.join(process.cwd(), "public/cv/fonts/Poppins-Regular.ttf"), fontWeight: 400 },
    { src: path.join(process.cwd(), "public/cv/fonts/Poppins-SemiBold.ttf"), fontWeight: 600 },
] });
Font.registerHyphenationCallback(word => [word]);

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


const colors = {
    ink: "#0b1019", text: "#293342", muted: "#586779",
    accent: "#236db7", blue: "#4ea8ff", pale: "#eef4fa", rule: "#d6e2ef",
};
const styles = StyleSheet.create({
    page: { paddingTop: 24, paddingBottom: 32, fontFamily: "Poppins", fontSize: 8.3, lineHeight: 1.48, color: colors.text },
    header: { height: 118, marginTop: -24, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", paddingHorizontal: 28, marginBottom: 18 },
    ornament: { position: "absolute", right: 0, top: 0, width: 250, height: 118 },
    photo: { width: 87, height: 87, borderRadius: 44, objectFit: "cover", objectPosition: "50% 30%", borderWidth: 2, borderColor: "#3b5875" },
    identity: { marginLeft: 25, flex: 1 },
    name: { fontWeight: 600, fontSize: 29, lineHeight: 1.2, color: "#ffffff", letterSpacing: -0.7 },
    role: { fontSize: 12, color: colors.blue, marginTop: 6 },
    columns: { flexDirection: "row", paddingHorizontal: 28 },
    sidebar: { width: 155, paddingRight: 17, borderRightWidth: 0.7, borderRightColor: colors.rule },
    main: { flex: 1, paddingLeft: 20 },
    section: { marginBottom: 17 },
    sideSection: { marginBottom: 18 },
    sectionHeading: { flexDirection: "row", alignItems: "center", marginBottom: 9, paddingBottom: 4, borderBottomWidth: 0.7, borderBottomColor: colors.rule },
    headingMark: { width: 3, height: 11, backgroundColor: colors.blue, marginRight: 7 },
    sectionTitle: { fontWeight: 600, fontSize: 10.1, color: colors.ink },
    sideHeading: { fontWeight: 600, fontSize: 9.4, color: colors.ink, marginBottom: 7 },
    story: { fontSize: 8.5, lineHeight: 1.65, textAlign: "justify" },
    contactRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
    contactIcon: { width: 8, height: 9, marginRight: 6, marginTop: 1.3 },
    contactText: { flex: 1, fontSize: 7.2, textDecoration: "none", color: colors.text },
    skillGroup: { marginBottom: 9 },
    skillLabel: { fontWeight: 600, fontSize: 7.7, color: colors.accent, marginBottom: 2 },
    skillText: { fontSize: 8, lineHeight: 1.6 },
    language: { marginBottom: 4, fontSize: 8 },
    languageLevel: { color: colors.muted, fontSize: 7.3 },
    entry: { marginBottom: 8 },
    entryTitle: { fontWeight: 600, color: colors.ink, fontSize: 9.5, textDecoration: "none" },
    entryDate: { fontSize: 7.2, color: colors.muted },
    meta: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 1, marginBottom: 3 },
    subtitle: { fontSize: 7.4, color: "#173c68", flex: 1, paddingRight: 5 },
    paragraph: { marginTop: 1 },
    bullet: { flexDirection: "row", marginTop: 2 },
    bulletMark: { width: 9, color: colors.accent },
    bulletText: { flex: 1, fontSize: 8 },
    technologies: { fontSize: 7.5, color: "#287bb5", marginTop: 4 },
    footer: { position: "absolute", top: 821, right: 28 },
    footerText: { fontSize: 6.5, color: colors.muted },
});

function Heading({ title }: { title: string }) {
    return <View style={styles.sectionHeading}><View style={styles.headingMark} /><Text style={styles.sectionTitle}>{title}</Text></View>;
}

// Keep each entry intact and each heading attached to its first entry.
function Section<T>({ title, items, render, last = false }: { title: string; items: T[]; last?: boolean; render: (item: T) => React.ReactNode }) {
    return <View style={[styles.section, last ? { marginBottom: 0 } : {}]}>
        <View wrap={false}><Heading title={title} />{items[0] !== undefined && render(items[0])}</View>
        {items.slice(1).map((item, index) => <View key={index} wrap={false}>{render(item)}</View>)}
    </View>;
}

function EntryTitle({ title, href }: { title: string; href?: string }) {
    return href ? <Link src={href} style={styles.entryTitle}>{title}</Link> : <Text style={styles.entryTitle}>{title}</Text>;
}

function ContactRow({ icon, value, href }: { icon: IconDefinition; value: string; href?: string }) {
    const [width, height, , , paths] = icon.icon;
    return <View style={styles.contactRow}>
        <Svg viewBox={`0 0 ${width} ${height}`} style={styles.contactIcon}>
            {(Array.isArray(paths) ? paths : [paths]).map((d, i) => <Path key={i} d={d} fill={colors.accent} />)}
        </Svg>
        {href ? <Link src={href} style={styles.contactText}>{value}</Link> : <Text style={styles.contactText}>{value}</Text>}
    </View>;
}

const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Header({ data }: { data: CvData }) {
    return (<View style={styles.header} wrap={false}>
                <Svg viewBox="0 0 250 118" style={styles.ornament}>
                    {Array.from({ length: 10 }, (_, i) => <Path key={i} d={`M ${95 + i * 17} -20 Q ${5 + i * 15} 80 ${140 + i * 18} 145`} fill="none" stroke="#233e5d" strokeWidth={0.6} />)}
                </Svg>
                {/* react-pdf Image is not an HTML image and has no alt prop. */}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                {data.photo && <Image src={data.photo} style={styles.photo} />}
                <View style={styles.identity}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.role}>{data.role}</Text>
                </View>
            </View>);
}

function Footer() {
    return <View fixed style={styles.footer}>
        <Text style={styles.footerText} render={({ pageNumber, totalPages }) => totalPages > 1 ? `${pageNumber} / ${totalPages}` : ""} />
    </View>;
}

function Projects({ data }: { data: CvData }) {
    return <Section last title={data.labels.projects} items={data.projects} render={project => <View style={styles.entry}>
        <EntryTitle title={project.title} href={project.href} />
        <View style={styles.meta}><Text style={styles.subtitle}>{project.roles}</Text><Text style={styles.entryDate}>{project.date}</Text></View>
        <Text style={styles.paragraph}>{project.description}</Text>
        {project.technologies.length > 0 && <Text style={styles.technologies}>{project.technologies.join(" · ")}</Text>}
    </View>} />;
}

export default function CvDocument({ data, compact = false }: { data: CvData; compact?: boolean }) {
    const { labels, contact } = data;
    return <Document title={`${data.name} - ${labels.title}`} author={data.name} subject={data.role} language={data.locale}>
        <Page size="A4" style={styles.page}>
            <Header data={data} />
            <View style={styles.columns}>
                <View style={styles.sidebar}>
                    <View style={styles.sideSection}>
                        <Text style={styles.sideHeading}>{labels.profile}</Text>
                        <Text style={styles.story}>{data.profile}</Text>
                    </View>
                    <View style={styles.sideSection}>
                        <Text style={styles.sideHeading}>{labels.contact}</Text>
                        <ContactRow icon={faLocationDot} value={contact.location} />
                        {contact.phone && <ContactRow icon={faPhone} value={contact.phone} href={`tel:${contact.phone.replace(/\s+/g, "")}`} />}
                        <ContactRow icon={faEnvelope} value={contact.mail} href={`mailto:${contact.mail}`} />
                        <ContactRow icon={faGlobe} value={displayUrl(contact.website)} href={contact.website} />
                        <ContactRow icon={faGithub} value={displayUrl(contact.github)} href={contact.github} />
                        <ContactRow icon={faLinkedin} value={displayUrl(contact.linkedin)} href={contact.linkedin} />
                    </View>
                    <View style={styles.sideSection}>
                        <Text style={styles.sideHeading}>{labels.skills}</Text>
                        {data.skills.map(group => <View key={group.title} style={styles.skillGroup}>
                            <Text style={styles.skillLabel}>{group.title}</Text>
                            <Text style={styles.skillText}>{group.items.join(" · ")}</Text>
                        </View>)}
                    </View>
                    <View>
                        <Text style={styles.sideHeading}>{labels.languages}</Text>
                        {data.languages.map(language => <Text key={language.name} style={styles.language}>
                            {language.name}<Text style={styles.languageLevel}>{` / ${language.level}`}</Text>
                        </Text>)}
                    </View>
                </View>
                <View style={styles.main}>
                    <Section title={labels.education} items={data.education} render={school => <View style={styles.entry}>
                        <EntryTitle title={school.title} />
                        <View style={styles.meta}>
                            {school.href
                                ? <Link src={school.href} style={[styles.subtitle, { textDecoration: "none" }]}>{school.institution}</Link>
                                : <Text style={styles.subtitle}>{school.institution}</Text>}
                            <Text style={styles.entryDate}>{school.date}</Text>
                        </View>
                        <Text style={styles.paragraph}>{school.description}</Text>
                    </View>} />
                    <Section title={labels.experiences} items={data.experiences} render={exp => <View style={styles.entry}>
                        <EntryTitle title={exp.role} />
                        <View style={styles.meta}>
                            {exp.href
                                ? <Link src={exp.href} style={[styles.subtitle, { textDecoration: "none" }]}>{exp.organisation}</Link>
                                : <Text style={styles.subtitle}>{exp.organisation}</Text>}
                            <Text style={styles.entryDate}>{exp.date}</Text>
                        </View>
                        <Text style={styles.paragraph}>{exp.description}</Text>
                        {exp.tasks.map(task => <View key={task} style={styles.bullet}><Text style={styles.bulletMark}>•</Text><Text style={styles.bulletText}>{task}</Text></View>)}
                    </View>} />
                    {compact && <Projects data={data} />}
                </View>
            </View>
            <Footer />
        </Page>
        {!compact && <Page size="A4" style={styles.page}>
            <Header data={data} />
            <View style={{ paddingHorizontal: 28 }}><Projects data={data} /></View>
            <Footer />
        </Page>}
    </Document>;
}

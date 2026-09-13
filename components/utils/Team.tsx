import Link from "next/link";
import { ExternalURL } from "./ExternalLink";
import { useTranslations } from "next-intl";

export const AGON_KOLGECI: ExternalURL = { name: "Agon Kolgeci", href: "https://www.linkedin.com/in/agon-kolgeci/" };
export const FABIEN_GRAYSSAGUEL: ExternalURL = { name: "Fabien Grayssaguel", href: "https://playze.org/"};
export const LEO_RIVIERES: ExternalURL = { name: "Léo Rivieres", href: "https://www.linkedin.com/in/l%C3%A9o-rivieres-743489245/"};
export const ANTOINE_MAENDLY: ExternalURL = { name: "Antoine Maendly", href: "https://github.com/antoinemdly" };
export const ELIE_BUSSOD: ExternalURL = { name: "Elie Bussod", href: "https://github.com/nexiumito" };
export const DANIEL_DOSH: ExternalURL = { name: "Daniel Dosh", href: "https://github.com/DanyDosh" };
export const VIONA_CUFO: ExternalURL = { name: "Viona Cufo", href: "https://github.com/vionacufo" };
export const ALEXANDRE_RIEDO: ExternalURL = { name: "Alexandre Riedo", href: "https://www.linkedin.com/in/alexandre-riedo-08171959kindofblue/" }
export const DELPHINE_COURVOISIER: ExternalURL = { name: "Delphine Courvoisier", href: "https://www.linkedin.com/in/delphine-courvoisier-645b6363/" }
export const JEAN_LUC_FALCONE: ExternalURL = { name: "Jean-Luc Falcone", href: "https://spc.unige.ch/en/info/group-members/jean-luc-falcone/" }
export const CHRISTOPHE_CHARPILLOZ: ExternalURL = { name: "Christophe Charpilloz", href: "https://www.linkedin.com/in/christophe-charpilloz-9010692/?originalSubdomain=ch" }

export type Team = {
    role: string,
    members: ExternalURL[]
}

export default function Teams({ team }: { team?: Team[] }): React.ReactNode {
    const t = useTranslations("team");

    return (
        <ul className="flex flex-col gap-2 p-[revert] list-disc pl-4">
            {team?.map(team => {
                return (
                    <li key={team.role}>
                        <ul className="flex flex-row flex-wrap gap-2">
                            <p>{t(team.role, {count: team.members.length})}:</p>

                            {team.members.map((author, i) => {
                                return (
                                    <li key={author.name}>
                                        <Link key={author.name} href={author.href} target="_blank" className="underline">{author.name}</Link>

                                        {i < team.members.length - 1 && ','}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}
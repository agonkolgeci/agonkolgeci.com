import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function SocialLink(props: React.ComponentPropsWithoutRef<typeof Link>) {
    return (
        <li className="transition-all duration-300 hover:scale-125">
            <Link {...props} target="_blank"/>
        </li>
    )
}

export default function SocialsLinks(props: React.ComponentPropsWithoutRef<"ul">) {
    return (
        <ul {...props}>
            <SocialLink href="mailto:contact@agonkolgeci.com"><FontAwesomeIcon icon={faEnvelope} /></SocialLink>
            <SocialLink href="https://github.com/agonkolgeci"><FontAwesomeIcon icon={faGithub} /></SocialLink>
            <SocialLink href="https://www.linkedin.com/in/agon-kolgeci/"><FontAwesomeIcon icon={faLinkedin} /></SocialLink>
        </ul>
    );
}

import { getDefaultLocale } from "@/i18n/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// Canonical production origin — the single source of truth for absolute URLs
// used across metadata, the sitemap and robots.
export const siteUrl = "https://agonkolgeci.com";

// Square icon (with background) used as the social preview thumbnail.
const OG_IMAGE = "/logo_full.webp";

export type MetadataProps = {
  params?: {
    locale: string
  }
}

export type PageMetadataProps = {
  namespace: string,
  // Canonical path for this page (e.g. "/terms"). Defaults to the site root.
  // Without it a page inherits the root layout's canonical/og:url and wrongly
  // reports the homepage as its canonical.
  path?: string,
} & MetadataProps

async function resolveLocale(params: MetadataProps["params"]) {
  return await Promise.resolve(params?.locale || getDefaultLocale());
}

export async function getPageTranslations(metadata: PageMetadataProps) {
  const locale = await resolveLocale(metadata.params);
  return await getTranslations({ locale, namespace: metadata.namespace });
}

/** Full title shown in the tab and the social card, e.g. "Agon KOLGECI - Terms". */
export function formatTitle(name: string, label: string) {
  return `${name} - ${label}`;
}

/**
 * Shared social-share card structure, identical on every page:
 *   small grey line → job title (global.role)
 *   card title      → "Agon KOLGECI - <label>" (passed in)
 *   thumbnail       → square icon with background
 * The `title`, `description` and canonical `url` are passed in per page. A
 * nested openGraph replaces (does not merge with) the parent's, so every field
 * is set here explicitly.
 */
export async function getSocialCard(
  params: MetadataProps["params"],
  path: string,
  { title, description }: { title: string; description: string }
): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const global = await getTranslations({ locale, namespace: "global" });

  const role = global("role");

  return {
    openGraph: {
      type: "website",
      url: path,
      siteName: role,
      title,
      description,
      locale,
      images: OG_IMAGE
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: OG_IMAGE
    }
  };
}

export async function getPageMetadata(metadata: PageMetadataProps): Promise<Metadata> {
  const t = await getPageTranslations(metadata);
  const locale = await resolveLocale(metadata.params);
  const global = await getTranslations({ locale, namespace: "global" });

  const label = t("label");
  const fullTitle = formatTitle(global("title"), label);
  const description = t("description");
  const path = metadata.path ?? "/";

  const card = await getSocialCard(metadata.params, path, { title: fullTitle, description });

  return {
    // Short label runs through the root "Agon KOLGECI - %s" template for the tab
    // title; the card title uses the full "Agon KOLGECI - <label>" string.
    title: label,
    description,

    alternates: {
      canonical: path
    },
    ...card
  };
}

import type { Metadata, Viewport } from "next";
import { Syne, Poppins } from "next/font/google";

import "@/styles/globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { getDefaultLocale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { MetadataProps, getPageTranslations, getSocialCard, formatTitle, siteUrl } from "@/lib/metadata";

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap'
});

export const isDev = process.env.NODE_ENV === 'development';

export const viewport: Viewport = {
  // Brand accent — colours the Discord/Slack embed strip and mobile browser UI.
  themeColor: "#4ea8ff",
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const t = await getPageTranslations({ namespace: "global", params });
  const devPrefix = isDev ? "[DEV]" : ""
  // Home tab title = "Agon KOLGECI — Portfolio"; the card reuses this same title.
  const homeTitle = formatTitle(t("title"), t("label"));
  const card = await getSocialCard(params, "/", { title: homeTitle, description: t("portfolio") });

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: `${devPrefix} ${homeTitle}`,
      template: `${devPrefix} ${t("title")} — %s`
    },
    description: t("description"),

    keywords: t("keywords"),
    authors: { name: t("title"), url: siteUrl },
    creator: t("title"),
    publisher: t("title"),

    // Single-page site: everything canonicalises to the root URL.
    alternates: {
      canonical: "/"
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },

    // Uniform social-share card (name / job title / portfolio blurb).
    ...card
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("global");

  // Person structured data — helps search engines build a rich knowledge panel
  // for a personal portfolio. Serialized into a single <script type="application/ld+json">.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("title"),
    url: siteUrl,
    image: `${siteUrl}/logo_full.webp`,
    jobTitle: t("role"),
    description: t("description"),
    email: "contact@agonkolgeci.com",
    sameAs: [
      "https://github.com/agonkolgeci",
      "https://www.linkedin.com/in/agon-kolgeci/"
    ]
  };

  return (
    <html lang={locale} className={`${syne.variable} ${poppins.variable}`}>
      <body className="bg-primary text-white selection:bg-accent-blue selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header/>

          <main className="w-full relative min-h-screen">
            {/* Global full-bleed ambient background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {/* Tech dot-grid (edges faded horizontally so it never cuts net) */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                  maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)"
                }}
              />
              {/* 
                Accent lighting. These used to be five 500px circles each carrying a
                blur(120px) filter and its own compositor layer, which Firefox had to
                re-rasterise while scrolling. A blurred circle is a radial gradient, so
                they are now painted as one plain background — same look, no filters.
              */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: [
                    "radial-gradient(760px 760px at 14% 3%, rgba(78,168,255,0.16), transparent 70%)",
                    "radial-gradient(720px 720px at 88% 24%, rgba(98,226,213,0.14), transparent 70%)",
                    "radial-gradient(740px 740px at 10% 46%, rgba(78,168,255,0.13), transparent 70%)",
                    "radial-gradient(720px 720px at 90% 68%, rgba(98,226,213,0.15), transparent 70%)",
                    "radial-gradient(700px 700px at 18% 88%, rgba(78,168,255,0.13), transparent 70%)"
                  ].join(", ")
                }}
              />
            </div>

            <div className="relative w-full">
              {children}
            </div>
          </main>

          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
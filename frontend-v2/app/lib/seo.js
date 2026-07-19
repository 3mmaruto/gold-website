import { getContent, isSupportedLocale, oppositeLocale } from "./content";
import { getCatalog } from "./catalog";

export const productionOrigin = "https://gold-group-hvac.com";
export const socialImage = `${productionOrigin}/media/hero/gold-heat-pump-hero-v1.png`;

const pagePath = {
  home: "",
  about: "about/",
  products: "products/",
  contact: "contact/",
  heatPumps: "heat-pumps/",
  underfloorHeating: "underfloor-heating/",
};

export function localizedPath(locale, page = "home") {
  return `/${locale}/${pagePath[page]}`;
}

export function absoluteUrl(locale, page = "home") {
  return `${productionOrigin}${localizedPath(locale, page)}`;
}

export function buildMeta(locale, page) {
  const safeLocale = isSupportedLocale(locale) ? locale : "ar";
  const content = getContent(safeLocale);
  const seo = content.seo[page];
  const url = absoluteUrl(safeLocale, page);
  const ogLocale = safeLocale === "ar" ? "ar_SY" : "en_US";
  const alternateOgLocale = safeLocale === "ar" ? "en_US" : "ar_SY";

  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "GOLD | Gold Group" },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:url", content: url },
    { property: "og:locale", content: ogLocale },
    { property: "og:locale:alternate", content: alternateOgLocale },
    { property: "og:image", content: socialImage },
    { property: "og:image:width", content: "1672" },
    { property: "og:image:height", content: "941" },
    { property: "og:image:alt", content: content.home.hero.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: socialImage },
  ];
}

export function buildLinks(locale, page) {
  const safeLocale = isSupportedLocale(locale) ? locale : "ar";
  const otherLocale = oppositeLocale(safeLocale);

  return [
    { rel: "canonical", href: absoluteUrl(safeLocale, page) },
    { rel: "alternate", hrefLang: safeLocale, href: absoluteUrl(safeLocale, page) },
    { rel: "alternate", hrefLang: otherLocale, href: absoluteUrl(otherLocale, page) },
    { rel: "alternate", hrefLang: "x-default", href: `${productionOrigin}/` },
  ];
}

export function landingMeta() {
  return [
    { title: "GOLD | Heat Pumps & HVAC Systems | مضخات حرارية" },
    {
      name: "description",
      content: "Choose Arabic or English to explore GOLD heat pumps and integrated heating, cooling and hot-water systems in Syria.",
    },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "GOLD | Gold Group" },
    { property: "og:title", content: "GOLD Heat Pumps & HVAC Systems" },
    { property: "og:url", content: `${productionOrigin}/` },
    { property: "og:image", content: socialImage },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export function landingLinks() {
  return [
    { rel: "canonical", href: `${productionOrigin}/` },
    { rel: "alternate", hrefLang: "ar", href: `${productionOrigin}/ar/` },
    { rel: "alternate", hrefLang: "en", href: `${productionOrigin}/en/` },
    { rel: "alternate", hrefLang: "x-default", href: `${productionOrigin}/` },
  ];
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gold Group",
  alternateName: ["GOLD", "شركة غولد غروب"],
  url: `${productionOrigin}/`,
  logo: `${productionOrigin}/media/brand/gold-logo-new-4.png`,
  email: "sk.group@windowslive.com",
  telephone: "+963948529207",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Marota City",
    addressLocality: "Damascus",
    addressRegion: "Damascus",
    addressCountry: "SY",
  },
  areaServed: {
    "@type": "Country",
    name: "Syria",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+963948529207",
    email: "sk.group@windowslive.com",
    availableLanguage: ["Arabic", "English"],
    areaServed: "SY",
  },
  foundingDate: "2008",
};

export function websiteJsonLd(locale) {
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.brand.companyName,
    alternateName: "GOLD",
    url: absoluteUrl(locale, "home"),
    inLanguage: locale,
  };
}

export function breadcrumbsJsonLd(locale, page, label) {
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.navigation.home,
        item: absoluteUrl(locale, "home"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: absoluteUrl(locale, page),
      },
    ],
  };
}

export function categoryListJsonLd(locale) {
  const content = getContent(locale);
  const catalog = getCatalog(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: content.products.title,
    numberOfItems: catalog.products.length,
    itemListElement: catalog.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.summary,
        category: product.categoryLabel,
        image: `${productionOrigin}${product.images[0].fallback}`,
        url: `${absoluteUrl(locale, "products")}#${product.id}`,
      },
    })),
  };
}

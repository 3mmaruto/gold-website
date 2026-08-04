import { buildLinks, buildProductLinks } from "../lib/seo";

export default function SeoLinks({ locale, page, productSlug }) {
  const links = productSlug
    ? buildProductLinks(locale, productSlug)
    : buildLinks(locale, page);

  return links.map((link) => (
    <link
      key={`${link.rel}-${link.hrefLang || "canonical"}`}
      rel={link.rel}
      href={link.href}
      hrefLang={link.hrefLang}
    />
  ));
}

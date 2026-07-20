import { buildLinks } from "../lib/seo";

export default function SeoLinks({ locale, page }) {
  return buildLinks(locale, page).map((link) => (
    <link
      key={`${link.rel}-${link.hrefLang || "canonical"}`}
      rel={link.rel}
      href={link.href}
      hrefLang={link.hrefLang}
    />
  ));
}

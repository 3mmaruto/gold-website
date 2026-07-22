import { FiDownload, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router";
import BrandLogo from "./BrandLogo";

export default function SiteFooter({ locale, content, ui }) {
  const nav = content.navigation.menu.flatMap((item) =>
    item.children
      ? item.children.map((child) => [child.label, `/${locale}/${child.path}`])
      : [[item.label, `/${locale}/${item.path}`]],
  );

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand" data-reveal>
          <BrandLogo alt={`${content.brand.name} logo`} />
          <div>
            <p className="eyebrow">{content.brand.companyName}</p>
            <h2>{content.footer.summary}</h2>
          </div>
        </div>

        <nav className="footer-nav" aria-label={content.navigation.home} data-reveal>
          {nav.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>

        <address className="footer-contact" data-reveal>
          <a href="tel:+963948529207"><FiPhone aria-hidden="true" /> <span dir="ltr">{content.contact.phone}</span></a>
          <a href={`mailto:${content.contact.email}`}><FiMail aria-hidden="true" /> {content.contact.email}</a>
          <span><FiMapPin aria-hidden="true" /> {content.contact.location}</span>
          <a href="/catalog/catalog.pdf" download>
            <FiDownload aria-hidden="true" /> {content.products.catalogCta}
          </a>
        </address>
      </div>
      <div className="container footer-bottom">
        <p>{ui.copyrightPrefix} {content.footer.copyright}</p>
        <p dir="ltr">gold-group-hvac.com</p>
      </div>
    </footer>
  );
}

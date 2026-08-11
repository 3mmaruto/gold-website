import {
  FiChevronDown,
  FiDownload,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router";
import BrandLogo from "./BrandLogo";

export default function SiteFooter({ locale, content, ui }) {
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

        <nav
          className="footer-nav"
          aria-label={content.navigation.home}
          data-reveal
        >
          {content.navigation.menu.map((item) => {
            if (item.id === "products" && item.children) {
              return (
                <details className="footer-nav-group" key={item.id}>
                  <summary>
                    <span>{item.label}</span>
                    <FiChevronDown aria-hidden="true" />
                  </summary>
                  <div className="footer-product-links">
                    {item.children.map((child) => (
                      <Link key={child.id} to={`/${locale}/${child.path}`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            }

            if (item.children) {
              return item.children.map((child) => (
                <Link key={child.id} to={`/${locale}/${child.path}`}>
                  {child.label}
                </Link>
              ));
            }

            return (
              <Link key={item.id} to={`/${locale}/${item.path}`}>
                {item.label}
              </Link>
            );
          })}
          <Link to={`/${locale}/manufacturer-documents/`}>
            {content.navigation.qualityDocuments}
          </Link>
        </nav>

        <address className="footer-contact" data-reveal>
          <a href="tel:+963948529207">
            <FiPhone aria-hidden="true" />{" "}
            <span dir="ltr">{content.contact.phone}</span>
          </a>
          <a
            className="footer-whatsapp-link"
            href="https://wa.me/963948529207"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp aria-hidden="true" /> {content.footer.whatsapp}
          </a>
          <a href={`mailto:${content.contact.email}`}>
            <FiMail aria-hidden="true" /> {content.contact.email}
          </a>
          <span>
            <FiMapPin aria-hidden="true" /> {content.contact.location}
          </span>
          <a href="/catalog/catalog.pdf" download>
            <FiDownload aria-hidden="true" /> {content.products.catalogCta}
          </a>
        </address>
      </div>
      <div className="container footer-bottom">
        <p>
          {ui.copyrightPrefix} {content.footer.copyright}
        </p>
        <p dir="ltr">gold-group-hvac.com</p>
      </div>
    </footer>
  );
}

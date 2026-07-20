import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router";
import { oppositeLocale } from "../lib/content";
import BrandLogo from "./BrandLogo";

function equivalentPath(pathname, nextLocale) {
  return pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${nextLocale}`);
}

export default function SiteHeader({ locale, content, ui }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const otherLocale = oppositeLocale(locale);
  const homePath = `/${locale}/`;
  const navigation = [
    [content.navigation.home, homePath],
    [content.navigation.heatPumps, `/${locale}/heat-pumps/`],
    [content.navigation.underfloorHeating, `/${locale}/underfloor-heating/`],
    [content.navigation.products, `/${locale}/products/`],
    [content.navigation.about, `/${locale}/about/`],
    [content.navigation.contact, `/${locale}/contact/`],
  ];

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <div className="container header-inner">
        <Link className="header-brand" to={homePath} aria-label={content.brand.companyName}>
          <BrandLogo alt={`${content.brand.name} logo`} />
          <span className="header-brand-copy">
            <strong>GOLD</strong>
            <small>{content.brand.tagline}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label={content.navigation.home}>
          {navigation.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === homePath}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              prefetch="intent"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            className="language-switch"
            to={equivalentPath(pathname, otherLocale)}
            hrefLang={otherLocale}
            lang={otherLocale}
          >
            {content.navigation.languageLabel}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? ui.closeMenu : ui.menu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label={content.navigation.home}
      >
        <div className="container mobile-nav-inner">
          {navigation.map(([label, to], index) => (
            <NavLink
              key={to}
              to={to}
              end={to === homePath}
              onClick={() => setOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

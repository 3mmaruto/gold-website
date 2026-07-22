import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router";
import { oppositeLocale } from "../lib/content";
import BrandLogo from "./BrandLogo";

function equivalentPath(pathname, nextLocale) {
  return pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${nextLocale}`);
}

function itemPath(locale, item) {
  return `/${locale}/${item.path}`;
}

export default function SiteHeader({ locale, content, ui }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const { pathname } = useLocation();
  const otherLocale = oppositeLocale(locale);
  const homePath = `/${locale}/`;
  const menu = content.navigation.menu;
  const solutionsGroup = menu.find((item) => item.id === "solutions");
  const primaryItems = menu.filter((item) => item.id !== "solutions");
  const solutionsActive = solutionsGroup.children.some(
    (item) => pathname === itemPath(locale, item),
  );
  const solutionsButtonRef = useRef(null);
  const solutionsMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  function solutionLinks() {
    return [...(solutionsMenuRef.current?.querySelectorAll("a") ?? [])];
  }

  function closeSolutions({ restoreFocus = false } = {}) {
    setSolutionsOpen(false);
    if (restoreFocus) solutionsButtonRef.current?.focus();
  }

  function focusSolution(position = "first") {
    requestAnimationFrame(() => {
      const links = solutionLinks();
      const link = position === "last" ? links.at(-1) : links[0];
      link?.focus();
    });
  }

  function handleSolutionsButtonKeyDown(event) {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      setSolutionsOpen(true);
      focusSolution(event.key === "ArrowUp" ? "last" : "first");
    }
    if (event.key === "Escape" && solutionsOpen) {
      event.preventDefault();
      closeSolutions({ restoreFocus: true });
    }
  }

  function handleSolutionLinkKeyDown(event) {
    const links = solutionLinks();
    const index = links.indexOf(event.currentTarget);

    if (event.key === "Escape") {
      event.preventDefault();
      closeSolutions({ restoreFocus: true });
      return;
    }

    const destinations = {
      ArrowDown: (index + 1) % links.length,
      ArrowUp: (index - 1 + links.length) % links.length,
      Home: 0,
      End: links.length - 1,
    };

    if (event.key in destinations) {
      event.preventDefault();
      links[destinations[event.key]]?.focus();
    }
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    setMobileOpen(false);
    setMobileSolutionsOpen(false);
    if (restoreFocus) menuToggleRef.current?.focus();
  }

  useEffect(() => {
    setMobileOpen(false);
    setMobileSolutionsOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!solutionsOpen) return undefined;

    function handleOutsidePointer(event) {
      if (!solutionsMenuRef.current?.contains(event.target)) {
        closeSolutions();
      }
    }

    function handleFocusOutside(event) {
      if (!solutionsMenuRef.current?.contains(event.target)) {
        closeSolutions();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("focusin", handleFocusOutside);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("focusin", handleFocusOutside);
    };
  }, [solutionsOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") return;
      if (solutionsOpen) {
        closeSolutions({ restoreFocus: true });
      } else if (mobileOpen) {
        closeMobileMenu({ restoreFocus: true });
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, solutionsOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

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
          <NavLink
            to={itemPath(locale, primaryItems[0])}
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
            prefetch="intent"
          >
            {primaryItems[0].label}
          </NavLink>

          <div className="solutions-nav" ref={solutionsMenuRef}>
            <button
              ref={solutionsButtonRef}
              type="button"
              className={`solutions-nav-trigger ${solutionsActive ? "active" : ""}`}
              aria-expanded={solutionsOpen}
              aria-controls="desktop-solutions-menu"
              aria-haspopup="true"
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) setSolutionsOpen(true);
              }}
              onClick={() => setSolutionsOpen((value) => !value)}
              onKeyDown={handleSolutionsButtonKeyDown}
            >
              <span>{solutionsGroup.label}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            <div
              id="desktop-solutions-menu"
              className={`solutions-popover ${solutionsOpen ? "is-open" : ""}`}
              aria-hidden={!solutionsOpen}
            >
              {solutionsGroup.children.map((item) => (
                <NavLink
                  key={item.id}
                  to={itemPath(locale, item)}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  tabIndex={solutionsOpen ? 0 : -1}
                  onKeyDown={handleSolutionLinkKeyDown}
                  onClick={() => closeSolutions()}
                  prefetch="intent"
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {primaryItems.slice(1).map((item) => {
            const to = itemPath(locale, item);
            return (
              <NavLink
                key={item.id}
                to={to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                prefetch="intent"
              >
                {item.label}
              </NavLink>
            );
          })}
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
            ref={menuToggleRef}
            type="button"
            className="menu-toggle"
            aria-label={mobileOpen ? ui.closeMenu : ui.menu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${mobileOpen ? "is-open" : ""}`}
        aria-label={content.navigation.home}
        aria-hidden={!mobileOpen}
      >
        <div className="container mobile-nav-inner">
          <NavLink
            to={itemPath(locale, primaryItems[0])}
            end
            tabIndex={mobileOpen ? 0 : -1}
            onClick={() => closeMobileMenu()}
          >
            <span>01</span>
            {primaryItems[0].label}
          </NavLink>

          <div className={`mobile-solutions ${solutionsActive ? "has-active-child" : ""}`}>
            <button
              type="button"
              className="mobile-solutions-trigger"
              aria-expanded={mobileSolutionsOpen}
              aria-controls="mobile-solutions-links"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => setMobileSolutionsOpen((value) => !value)}
            >
              <span>02</span>
              <strong>{solutionsGroup.label}</strong>
              <FiChevronDown aria-hidden="true" />
            </button>
            <div
              id="mobile-solutions-links"
              className={`mobile-solutions-links ${mobileSolutionsOpen ? "is-open" : ""}`}
            >
              {solutionsGroup.children.map((item) => (
                <NavLink
                  key={item.id}
                  to={itemPath(locale, item)}
                  tabIndex={mobileOpen && mobileSolutionsOpen ? 0 : -1}
                  onClick={() => closeMobileMenu()}
                >
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </NavLink>
              ))}
            </div>
          </div>

          {primaryItems.slice(1).map((item, index) => (
            <NavLink
              key={item.id}
              to={itemPath(locale, item)}
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => closeMobileMenu()}
            >
              <span>{String(index + 3).padStart(2, "0")}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

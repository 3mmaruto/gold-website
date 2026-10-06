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

function groupIsActive(group, locale, pathname) {
  return group.children.some((item) => pathname === itemPath(locale, item));
}

export default function SiteHeader({ locale, content, ui }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopGroupOpen, setDesktopGroupOpen] = useState(null);
  const [mobileGroupOpen, setMobileGroupOpen] = useState(null);
  const { pathname } = useLocation();
  const otherLocale = oppositeLocale(locale);
  const homePath = `/${locale}/`;
  const menu = content.navigation.menu;
  const headerRef = useRef(null);
  const headerInnerRef = useRef(null);
  const pendingGroupFocusRef = useRef(null);
  const menuToggleRef = useRef(null);
  const solutionsButtonRef = useRef(null);
  const productsButtonRef = useRef(null);
  const mobileSolutionsButtonRef = useRef(null);
  const mobileProductsButtonRef = useRef(null);
  const solutionsMenuRef = useRef(null);
  const productsMenuRef = useRef(null);
  const buttonRefs = {
    solutions: solutionsButtonRef,
    products: productsButtonRef,
  };
  const menuRefs = {
    solutions: solutionsMenuRef,
    products: productsMenuRef,
  };
  const mobileButtonRefs = {
    solutions: mobileSolutionsButtonRef,
    products: mobileProductsButtonRef,
  };

  function groupLinks(groupId) {
    return [...(menuRefs[groupId]?.current?.querySelectorAll("a") ?? [])];
  }

  function closeDesktopGroup({ restoreFocus = false } = {}) {
    const closingGroup = desktopGroupOpen;
    setDesktopGroupOpen(null);
    if (restoreFocus && closingGroup) buttonRefs[closingGroup]?.current?.focus();
  }

  function focusGroupLink(groupId, position = "first") {
    // Let visibility:hidden transition to visible before focusing a cold-open menu.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (buttonRefs[groupId]?.current?.getAttribute("aria-expanded") !== "true") return;
      const links = groupLinks(groupId);
      const link = position === "last" ? links.at(-1) : links[0];
      link?.focus();
    }));
  }

  function handleGroupButtonKeyDown(event, groupId) {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const position = event.key === "ArrowUp" ? "last" : "first";
      if (desktopGroupOpen === groupId) {
        focusGroupLink(groupId, position);
      } else {
        pendingGroupFocusRef.current = { groupId, position };
        setDesktopGroupOpen(groupId);
      }
    }

    if (event.key === "Escape" && desktopGroupOpen === groupId) {
      event.preventDefault();
      closeDesktopGroup({ restoreFocus: true });
    }
  }

  function handleGroupLinkKeyDown(event, groupId) {
    const links = groupLinks(groupId);
    const index = links.indexOf(event.currentTarget);

    if (event.key === "Escape") {
      event.preventDefault();
      closeDesktopGroup({ restoreFocus: true });
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
    setMobileGroupOpen(null);
    if (restoreFocus) menuToggleRef.current?.focus();
  }

  useEffect(() => {
    setMobileOpen(false);
    setMobileGroupOpen(null);
    setDesktopGroupOpen(null);
  }, [pathname]);

  useEffect(() => {
    // Focus only after React has committed the open/visible menu to the DOM.
    const pending = pendingGroupFocusRef.current;
    pendingGroupFocusRef.current = null;
    if (pending?.groupId === desktopGroupOpen) focusGroupLink(pending.groupId, pending.position);
  }, [desktopGroupOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1051px)");
    function closeAtBreakpoint() {
      const focused = document.activeElement;
      const mobileHadFocus = focused === menuToggleRef.current || headerRef.current?.querySelector(".mobile-nav")?.contains(focused);
      const desktopHadFocus = headerRef.current?.querySelector(".desktop-nav")?.contains(focused);
      setMobileOpen(false);
      setMobileGroupOpen(null);
      setDesktopGroupOpen(null);
      if (desktop.matches && mobileHadFocus) headerRef.current?.querySelector(".desktop-nav a")?.focus();
      if (!desktop.matches && desktopHadFocus) menuToggleRef.current?.focus();
    }
    desktop.addEventListener("change", closeAtBreakpoint);
    return () => desktop.removeEventListener("change", closeAtBreakpoint);
  }, []);

  useEffect(() => {
    // Measure the header row, not the expanded menu, to avoid resize feedback.
    // visualViewport also follows mobile browser chrome and viewport zoom.
    const viewport = window.visualViewport;
    function updateAvailableHeight() {
      const bottom = headerInnerRef.current?.getBoundingClientRect().bottom ?? 0;
      const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      headerRef.current?.style.setProperty(
        "--navigation-available-height",
        `${Math.max(0, viewportBottom - bottom - 12)}px`,
      );
    }
    updateAvailableHeight();
    const observer = new ResizeObserver(updateAvailableHeight);
    observer.observe(headerInnerRef.current);
    window.addEventListener("resize", updateAvailableHeight);
    viewport?.addEventListener("resize", updateAvailableHeight);
    viewport?.addEventListener("scroll", updateAvailableHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateAvailableHeight);
      viewport?.removeEventListener("resize", updateAvailableHeight);
      viewport?.removeEventListener("scroll", updateAvailableHeight);
    };
  }, []);

  useEffect(() => {
    if (!desktopGroupOpen) return undefined;
    const activeMenuRef = menuRefs[desktopGroupOpen];

    function handleOutsidePointer(event) {
      if (!activeMenuRef?.current?.contains(event.target)) closeDesktopGroup();
    }

    function handleFocusOutside(event) {
      if (!activeMenuRef?.current?.contains(event.target)) closeDesktopGroup();
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("focusin", handleFocusOutside);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("focusin", handleFocusOutside);
    };
  }, [desktopGroupOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") return;
      if (desktopGroupOpen) {
        closeDesktopGroup({ restoreFocus: true });
      } else if (mobileGroupOpen) {
        const closingGroup = mobileGroupOpen;
        setMobileGroupOpen(null);
        requestAnimationFrame(() => mobileButtonRefs[closingGroup]?.current?.focus());
      } else if (mobileOpen) {
        closeMobileMenu({ restoreFocus: true });
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [desktopGroupOpen, mobileGroupOpen, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleOutsidePointer(event) {
      if (!headerRef.current?.contains(event.target)) closeMobileMenu();
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [mobileOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <div className="container header-inner" ref={headerInnerRef}>
        <Link className="header-brand" to={homePath} aria-label={content.brand.companyName}>
          <BrandLogo alt={`${content.brand.name} logo`} />
          <span className="header-brand-copy">
            <strong>GOLD</strong>
            <small>{content.brand.tagline}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label={content.navigation.home}>
          {menu.map((item) => {
            if (item.href) {
              return <a key={item.id} href={item.href} className="nav-lab-link">{item.label}</a>;
            }
            if (!item.children) {
              return (
                <NavLink
                  key={item.id}
                  to={itemPath(locale, item)}
                  end={item.id === "home"}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  prefetch="intent"
                >
                  {item.label}
                </NavLink>
              );
            }

            const open = desktopGroupOpen === item.id;
            const active = groupIsActive(item, locale, pathname);
            return (
              <div className="solutions-nav" ref={menuRefs[item.id]} key={item.id}>
                <button
                  ref={buttonRefs[item.id]}
                  type="button"
                  className={`solutions-nav-trigger ${active ? "active" : ""}`}
                  aria-expanded={open}
                  aria-controls={`desktop-${item.id}-menu`}
                  onClick={() => setDesktopGroupOpen((value) => (value === item.id ? null : item.id))}
                  onKeyDown={(event) => handleGroupButtonKeyDown(event, item.id)}
                >
                  <span>{item.label}</span>
                  <FiChevronDown aria-hidden="true" />
                </button>
                <div
                  id={`desktop-${item.id}-menu`}
                  className={`solutions-popover ${open ? "is-open" : ""}`}
                  aria-hidden={!open}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={itemPath(locale, child)}
                      end={child.id === "allProducts"}
                      className={({ isActive }) => (isActive ? "active" : undefined)}
                      tabIndex={open ? 0 : -1}
                      onKeyDown={(event) => handleGroupLinkKeyDown(event, item.id)}
                      onClick={() => closeDesktopGroup()}
                      prefetch="intent"
                    >
                      <strong>{child.label}</strong>
                      <span>{child.description}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
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
            onClick={() => {
              if (mobileOpen) closeMobileMenu();
              else setMobileOpen(true);
            }}
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
          {menu.map((item, index) => {
            if (item.href) {
              return (
                <a key={item.id} href={item.href} className="nav-lab-link" tabIndex={mobileOpen ? 0 : -1} onClick={() => closeMobileMenu()}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              );
            }
            if (!item.children) {
              return (
                <NavLink
                  key={item.id}
                  to={itemPath(locale, item)}
                  end={item.id === "home"}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => closeMobileMenu()}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </NavLink>
              );
            }

            const open = mobileGroupOpen === item.id;
            const active = groupIsActive(item, locale, pathname);
            return (
              <div className={`mobile-solutions ${active ? "has-active-child" : ""}`} key={item.id}>
                <button
                  ref={mobileButtonRefs[item.id]}
                  type="button"
                  className="mobile-solutions-trigger"
                  aria-expanded={open}
                  aria-controls={`mobile-${item.id}-links`}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileGroupOpen((value) => (value === item.id ? null : item.id))}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <FiChevronDown aria-hidden="true" />
                </button>
                <div
                  id={`mobile-${item.id}-links`}
                  className={`mobile-solutions-links ${open ? "is-open" : ""}`}
                  aria-hidden={!open}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={itemPath(locale, child)}
                      end={child.id === "allProducts"}
                      tabIndex={mobileOpen && open ? 0 : -1}
                      onClick={() => closeMobileMenu()}
                    >
                      <strong>{child.label}</strong>
                      <small>{child.description}</small>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

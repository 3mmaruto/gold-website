import { Link } from "react-router";

export default function PageHero({ locale, eyebrow, title, intro, pageLabel, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="container page-hero-inner">
        <nav className="breadcrumbs" aria-label="Breadcrumb" data-reveal>
          <Link to={`/${locale}/`}>{locale === "ar" ? "الرئيسية" : "Home"}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{pageLabel}</span>
        </nav>
        <div className="page-hero-copy" data-reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

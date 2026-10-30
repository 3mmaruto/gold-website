import { Link } from "react-router";

export default function PageHero({ locale, eyebrow, title, intro, pageLabel, children, className = "" }) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="container page-hero-inner">
        <nav className="breadcrumbs" aria-label={locale === "ar" ? "مسار الصفحة" : "Breadcrumb"} data-reveal>
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

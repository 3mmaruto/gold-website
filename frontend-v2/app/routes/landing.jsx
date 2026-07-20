import BrandLogo from "../components/BrandLogo";
import JsonLd from "../components/JsonLd";
import ResponsivePicture from "../components/ResponsivePicture";
import { landingLinks, landingMeta, productionOrigin } from "../lib/seo";

export const meta = landingMeta;
export const links = landingLinks;

const landingWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gold Group",
  alternateName: ["GOLD", "غولد غروب"],
  url: `${productionOrigin}/`,
  inLanguage: ["ar", "en"],
};

export default function LandingPage() {
  return (
    <main className="landing-page">
      <JsonLd data={landingWebsite} />
      <ResponsivePicture
        asset="hero"
        alt=""
        className="landing-background"
        imgClassName="landing-background-image"
        priority
      />
      <div className="landing-overlay" />
      <div className="landing-grid" aria-hidden="true" />
      <div className="landing-content">
        <BrandLogo alt="GOLD logo" className="landing-logo" />
        <p className="landing-kicker">GOLD GROUP · DAMASCUS</p>
        <h1>Engineered comfort.<br /><span lang="ar" dir="rtl">راحة مدروسة.</span></h1>
        <p className="landing-intro">
          Heat-pump, heating, cooling and hot-water systems.<br />
          <span lang="ar" dir="rtl">أنظمة المضخات الحرارية والتدفئة والتبريد والمياه الساخنة.</span>
        </p>
        <div className="language-cards">
          <a href="/ar/" hrefLang="ar" lang="ar" dir="rtl">
            <small>العربية</small>
            <strong>دخول الموقع</strong>
            <span aria-hidden="true">←</span>
          </a>
          <a href="/en/" hrefLang="en" lang="en">
            <small>English</small>
            <strong>Enter website</strong>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}

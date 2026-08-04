import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router";
import { getSkProductProfiles } from "../data/skProducts";
import ResponsivePicture from "./ResponsivePicture";

export default function ProductProfileLinks({ locale, compact = false }) {
  const profiles = getSkProductProfiles(locale);
  const copy = locale === "ar"
    ? {
        eyebrow: "ملفات الموديلات",
        title: "بيانات أعمق لموديلات محددة.",
        body: "صفحات فنية مستقلة مبنية على دليل الدعم الحالي، لتسهيل مقارنة الاستطاعة والتغذية والتدفق والأبعاد.",
        cta: "عرض الملف التقني",
        capacity: "الاستطاعة الاسمية",
      }
    : {
        eyebrow: "Model profiles",
        title: "Deeper data for selected models.",
        body: "Dedicated technical pages based on the current support guide make capacity, supply, flow and dimensions easier to compare.",
        cta: "View technical profile",
        capacity: "Rated capacity",
      };

  return (
    <section className={`model-profiles-section ${compact ? "is-compact" : ""}`}>
      <div className="container model-profiles-layout">
        <header className="model-profiles-heading" data-reveal>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </header>
        <div className="model-profile-grid">
          {profiles.map((profile) => (
            <Link
              className="model-profile-card"
              key={profile.slug}
              to={`/${locale}/products/${profile.slug}/`}
              prefetch="intent"
              data-reveal
            >
              <span className="model-profile-media" aria-hidden="true">
                <ResponsivePicture
                  source={profile.image}
                  alt=""
                  className="model-profile-picture"
                  imgClassName="model-profile-image"
                  sizes="(max-width: 620px) 42vw, 190px"
                />
              </span>
              <span className="model-profile-copy">
                <small>{copy.capacity}</small>
                <strong dir="ltr">{profile.proof[0].value}</strong>
                <b>{profile.shortTitle}</b>
                <span>{copy.cta} <FiArrowUpRight aria-hidden="true" /></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

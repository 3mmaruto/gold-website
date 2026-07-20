import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import SeoLinks from "../components/SeoLinks";
import { getContent, getUi } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "contact");
}

export default function ContactPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);
  const ui = getUi(locale);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      ui.formIntro,
      "",
      `${content.contact.form.name}: ${data.get("name")}`,
      `${content.contact.form.phone}: ${data.get("phone")}`,
      `${content.contact.form.email}: ${data.get("email") || "-"}`,
      `${content.contact.form.project}: ${data.get("project")}`,
      "",
      `${content.contact.form.message}:`,
      data.get("message"),
    ];
    window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(ui.formSubject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  const contactItems = [
    { label: content.contact.phoneLabel, value: content.contact.phone, href: "tel:+963948529207", icon: FiPhone, ltr: true },
    { label: content.contact.landlineLabel, value: content.contact.landline, href: "tel:+963112334005", icon: FiPhone, ltr: true },
    { label: content.contact.emailLabel, value: content.contact.email, href: `mailto:${content.contact.email}`, icon: FiMail, ltr: true },
    { label: content.contact.locationLabel, value: content.contact.location, icon: FiMapPin },
  ];

  return (
    <>
      <SeoLinks locale={locale} page="contact" />
      <JsonLd data={breadcrumbsJsonLd(locale, "contact", content.navigation.contact)} />
      <PageHero
        locale={locale}
        eyebrow={content.contact.eyebrow}
        title={content.contact.title}
        intro={content.contact.intro}
        pageLabel={content.navigation.contact}
      />

      <section className="contact-section">
        <div className="container contact-layout">
          <div className="contact-details">
            <div className="contact-list">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const inner = <><Icon aria-hidden="true" /><span><small>{item.label}</small><strong dir={item.ltr ? "ltr" : undefined}>{item.value}</strong></span></>;
                return item.href ? (
                  <a key={item.label} href={item.href} data-reveal>{inner}</a>
                ) : (
                  <div key={item.label} data-reveal>{inner}</div>
                );
              })}
            </div>
            <div className="damascus-card" data-reveal>
              <span className="damascus-pin"><FiMapPin aria-hidden="true" /></span>
              <div>
                <p className="eyebrow">GOLD GROUP</p>
                <h2>{content.contact.location}</h2>
                <p>{content.footer.summary}</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} data-reveal>
            <div className="form-heading">
              <span>01</span>
              <div>
                <p className="eyebrow">{locale === "ar" ? "تفاصيل المشروع" : "Project details"}</p>
                <h2>{locale === "ar" ? "أرسل المعلومات الأساسية." : "Share the essentials."}</h2>
              </div>
            </div>
            <label>
              <span>{content.contact.form.name}</span>
              <input name="name" autoComplete="name" required />
            </label>
            <div className="form-row">
              <label>
                <span>{content.contact.form.phone}</span>
                <input name="phone" type="tel" autoComplete="tel" dir="ltr" required />
              </label>
              <label>
                <span>{content.contact.form.email} <small>({ui.optional})</small></span>
                <input name="email" type="email" autoComplete="email" dir="ltr" />
              </label>
            </div>
            <label>
              <span>{content.contact.form.project}</span>
              <select name="project" required defaultValue="">
                <option value="" disabled>—</option>
                {ui.projectOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>{content.contact.form.message}</span>
              <textarea name="message" rows="6" required />
            </label>
            <button className="button button--primary form-submit" type="submit">
              <span>{content.contact.form.submit}</span><span className="direction-arrow" aria-hidden="true">↗</span>
            </button>
            <p className="form-note">{ui.contactNote}</p>
          </form>
        </div>
      </section>
    </>
  );
}

import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import SeoLinks from "../components/SeoLinks";
import { getContent, getUi } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "contact");
}

const WHATSAPP_NUMBER = "963948529207";

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
      `${content.contact.form.address}: ${data.get("address")}`,
      `${content.contact.form.area}: ${data.get("area")} ${content.contact.form.areaUnit}`,
    ];
    const message = lines.join("\n");
    const channel = event.nativeEvent.submitter?.value;

    if (channel === "whatsapp") {
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      return;
    }

    window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(ui.formSubject)}&body=${encodeURIComponent(message)}`;
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
                <p className="eyebrow">{content.contact.form.eyebrow}</p>
                <h2>{content.contact.form.title}</h2>
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
                <span>{content.contact.form.area}</span>
                <input name="area" type="number" inputMode="decimal" min="1" step="0.1" dir="ltr" required />
              </label>
            </div>
            <label>
              <span>{content.contact.form.address}</span>
              <input name="address" autoComplete="street-address" required />
            </label>
            <div className="form-actions">
              <button className="button button--primary form-submit" type="submit" name="channel" value="email">
                <FiMail aria-hidden="true" />
                <span>{content.contact.form.sendEmail}</span>
              </button>
              <button className="button button--whatsapp form-submit" type="submit" name="channel" value="whatsapp">
                <FaWhatsapp aria-hidden="true" />
                <span>{content.contact.form.sendWhatsapp}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

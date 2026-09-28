import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import QuoteRequestForm from "../components/QuoteRequestForm";
import SeoLinks from "../components/SeoLinks";
import { getContent } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "contact");
}

export default function ContactPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);

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

          <QuoteRequestForm locale={locale} contact={content.contact} />
        </div>
      </section>
    </>
  );
}

import { FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { contact } from "../data/contact";
import { social } from "../data/social";

export default function ContactPage() {
  return (
    <section className="bg-brand-ivory px-6 py-24 text-brand-navy">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-copper">
            Contact Page Shell
          </p>
          <h1 className="mt-5 font-display text-5xl">
            Updated contact information is already integrated into v2.
          </h1>
          <div className="mt-8 space-y-5 text-slate-700">
            <a href={`mailto:${contact.email}`} className="flex gap-3">
              <FiMail className="mt-1 shrink-0 text-brand-gold" />
              <span>{contact.email}</span>
            </a>
            <a href={`tel:${contact.phoneHref}`} className="flex gap-3">
              <FiPhone className="mt-1 shrink-0 text-brand-gold" />
              <span>{contact.phone}</span>
            </a>
            {contact.addresses.map((address) => (
              <div key={address.label} className="flex gap-3">
                <FiMapPin className="mt-1 shrink-0 text-brand-gold" />
                <span>
                  <strong>{address.label}:</strong> {address.value}
                </span>
              </div>
            ))}
            <a
              href={social.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 text-brand-navy transition hover:text-brand-copper"
            >
              <FiFacebook className="mt-1 shrink-0 text-brand-gold" />
              <span>Facebook / Gold Group Syria</span>
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-brand-gold/15 bg-brand-navy shadow-panel">
          <iframe
            title="Gold Group location"
            src={contact.mapEmbed}
            className="h-full min-h-[460px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

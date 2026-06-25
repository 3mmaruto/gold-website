import { FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { contact } from "../../data/contact";
import { social } from "../../data/social";
import { site } from "../../data/site";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-brand-gold/10 bg-brand-navy text-white"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            Gold Group
          </p>
          <h3 className="mt-4 font-display text-3xl">
            Modern heating and cooling solutions with a premium technical edge.
          </h3>
          <p className="mt-5 max-w-xl text-white/70">
            Gold Group v2 replaces the old template voice with a cleaner, more
            premium brand system while keeping current production content and
            assets safe during the rebuild.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">Contact</h4>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-start gap-3 text-white/80 transition hover:text-white"
          >
            <FiMail className="mt-1 shrink-0 text-brand-gold" />
            <span>{contact.email}</span>
          </a>
          <a
            href={`tel:${contact.phoneHref}`}
            className="flex items-start gap-3 text-white/80 transition hover:text-white"
          >
            <FiPhone className="mt-1 shrink-0 text-brand-gold" />
            <span>{contact.phone}</span>
          </a>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 text-white/80 transition hover:text-brand-gold"
          >
            <span className="text-brand-gold">+</span>
            <span>Browse v2 product foundation</span>
          </Link>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Locations & Social
          </h4>
          {contact.addresses.map((address) => (
            <div key={address.label} className="flex items-start gap-3 text-white/75">
              <FiMapPin className="mt-1 shrink-0 text-brand-gold" />
              <span>
                <strong className="text-white">{address.label}:</strong>{" "}
                {address.value}
              </span>
            </div>
          ))}
          <a
            href={social.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 text-white/80 transition hover:text-brand-gold"
          >
            <FiFacebook className="text-brand-gold" />
            <span>Facebook / Gold Group Syria</span>
          </a>
          <a
            href={site.catalogPdf}
            className="inline-flex items-center gap-3 text-white/80 transition hover:text-brand-gold"
          >
            <span className="text-brand-gold">+</span>
            <span>Download current product catalog</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

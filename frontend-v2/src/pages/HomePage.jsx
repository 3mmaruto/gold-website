import Button from "../components/common/Button";
import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import HeroV2 from "../components/hero/HeroV2";
import ProductCard from "../components/products/ProductCard";
import { products } from "../data/products";
import { contact } from "../data/contact";

export default function HomePage() {
  const featuredProducts = products.slice(0, 2);

  return (
    <>
      <HeroV2 />

      <Section
        id="about"
        eyebrow="About Gold Group"
        title="A new homepage shell built around the real company identity."
        description="This first batch replaces the old template tone with a more premium HVAC direction while preserving the current site as a safe reference source."
        className="bg-brand-ivory"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            "Premium industrial color system based on deep navy, gold, copper, and ivory.",
            "Component-ready structure that can later connect to CMS, API, or product admin flows.",
            "Future-proof hero architecture prepared for a later Hero3D or HeroExperience upgrade.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-brand-gold/15 bg-white p-6 shadow-panel"
            >
              <p className="text-base leading-8 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="services" className="bg-white">
        <SectionHeading
          title="Technical confidence, energy efficiency, and product clarity."
          description="This section establishes the next narrative layer for why customers choose Gold Group, while staying lightweight in the first v2 batch."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Heating Systems",
              body: "Position premium heating systems, project planning capability, and long-term performance as core trust signals.",
            },
            {
              title: "Cooling Solutions",
              body: "Introduce cooling and climate control offerings in a cleaner and more premium way than the old static template grid.",
            },
            {
              title: "Support & Circulation",
              body: "Frame pumps, tanks, and supporting equipment as part of a coherent systems portfolio rather than scattered static blocks.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-slate-200 bg-brand-ivory p-6"
            >
              <h3 className="font-display text-2xl text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="products" className="bg-brand-mist/45">
        <SectionHeading
          title="Product highlight foundation"
          description="The new frontend starts with structured product data instead of hardcoded page blocks, making future CMS integration much easier."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section id="media" className="bg-white">
        <SectionHeading
          title="Media and project experience placeholder"
          description="This reserved section is where future installation media, case studies, product animation, or short company videos can live without forcing the first v2 batch to depend on 3D."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-brand-gold/15 bg-brand-navy shadow-panel">
            <img
              src="/media/company/team-work.jpg"
              alt="Gold Group team and project visual"
              className="h-[360px] w-full object-cover opacity-90"
            />
          </div>
          <div className="rounded-[2rem] border border-brand-gold/15 bg-brand-ivory p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-copper">
              Future upgrade slot
            </p>
            <h3 className="mt-4 font-display text-3xl text-brand-navy">
              Prepared for installation stories, product films, or future hero media.
            </h3>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The first batch only reserves the content architecture. We can
              later connect this to real media, a polished brand video, or a
              stronger product demo sequence after the homepage direction is
              approved.
            </p>
          </div>
        </div>
      </Section>

      <Section id="cta" className="bg-brand-navy text-white">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Contact CTA
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Ready for the next redesign phase once this foundation is approved.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/74">
              Email: {contact.email} <br />
              Phone: {contact.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href={`mailto:${contact.email}`} variant="primary">
              Email Gold Group
            </Button>
            <Button href="#/products" variant="secondary">
              Review Product Foundation
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

import Button from "../common/Button";
import { site } from "../../data/site";

const HERO_MEDIA = [
  "/media/hero/heat-pump-hero-01.JPG",
  "/media/hero/heat-pump-hero-02.JPG",
  "/media/company/company-cover.jpg",
];

export default function HeroV2() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-brand-navy text-white"
    >
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="absolute inset-0 bg-brand-grid bg-[length:24px_24px] opacity-25" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(200,155,60,0.12),transparent_62%)] lg:block" />

      <div className="relative mx-auto grid min-h-[78vh] w-full max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold">
            Gold Group v2 Foundation
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            Premium heating and cooling systems built for long-term performance.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            This first v2 batch establishes the new React frontend shell,
            upgraded visual identity, and future-ready hero architecture without
            blocking on 3D implementation.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#/products" variant="primary">
              Explore Products
            </Button>
            <Button href={site.catalogPdf} variant="secondary">
              Download Catalog PDF
            </Button>
          </div>

          <div className="mt-10 grid gap-5 border-t border-white/12 pt-8 sm:grid-cols-3">
            {site.heroHighlights.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-gold">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/74">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-6 hidden h-44 w-44 rounded-full border border-brand-gold/20 bg-brand-gold/10 blur-3xl lg:block" />
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-panel backdrop-blur-sm">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#0f1b35] p-4">
              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[1.5rem] border border-brand-gold/20 bg-black/20">
                  <img
                    src={HERO_MEDIA[0]}
                    alt="Gold Group featured heating system"
                    className="h-full min-h-[360px] w-full object-cover"
                  />
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                    <img
                      src={HERO_MEDIA[1]}
                      alt="Heat pump product detail"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <div className="rounded-[1.5rem] border border-brand-gold/20 bg-brand-ivory p-5 text-brand-navy">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-copper">
                      Future Hero Upgrade Path
                    </p>
                    <h2 className="mt-4 font-display text-2xl leading-tight">
                      HeroV2 now, Hero3D later
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-700">
                      This section is intentionally structured so a future
                      `Hero3D` or `HeroExperience` component can replace the
                      current visual media column without rewriting the whole
                      page shell.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

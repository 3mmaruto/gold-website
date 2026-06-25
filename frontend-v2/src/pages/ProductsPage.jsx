import Section from "../components/common/Section";
import SectionHeading from "../components/common/SectionHeading";
import ProductCard from "../components/products/ProductCard";
import { products } from "../data/products";

export default function ProductsPage() {
  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
            Product System Foundation
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">
            Structured product data now, CMS-ready product experience later.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
            This first version does not fully redesign the old products page
            yet. It establishes the component and data shape that later product
            pages, filters, specs, and API/CMS integrations can build on.
          </p>
        </div>
      </section>

      <Section className="bg-brand-ivory">
        <SectionHeading
          title="Sample products"
          description="These initial entries are sourced from currently available product assets and existing site content, but normalized into a cleaner frontend data model."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </>
  );
}

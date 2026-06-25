import Button from "../common/Button";

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-brand-gold/15 bg-white shadow-panel">
      <div className="relative h-72 overflow-hidden bg-brand-mist">
        <img
          src={product.images[0]}
          alt={product.name.en}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-full border border-brand-gold/30 bg-brand-navy/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
          {product.categoryLabel}
        </div>
      </div>
      <div className="p-7">
        <h3 className="font-display text-3xl text-brand-navy">
          {product.name.en}
        </h3>
        <p className="mt-4 text-base leading-8 text-slate-600">
          {product.summary.en}
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
          {product.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="#/products" variant="dark" className="px-4 py-2.5 text-xs">
            View Product System
          </Button>
          <Button href={product.catalogPdf} variant="secondary" className="px-4 py-2.5 text-xs">
            Catalog PDF
          </Button>
        </div>
      </div>
    </article>
  );
}

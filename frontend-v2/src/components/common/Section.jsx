export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section id={id} className={`py-20 ${className}`.trim()}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow ? (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-copper">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-display text-4xl leading-tight text-brand-navy sm:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

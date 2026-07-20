export default function Section({
  children,
  className = "",
  id,
  eyebrow,
  title,
  body,
  headingLevel = "h2",
}) {
  const Heading = headingLevel;

  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="container">
        {(eyebrow || title || body) && (
          <header className="section-heading" data-reveal>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <Heading>{title}</Heading> : null}
            {body ? <p className="section-lead">{body}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

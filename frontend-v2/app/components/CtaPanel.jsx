import Button from "./Button";

export default function CtaPanel({ title, body, button, to, secondary, secondaryHref }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-panel" data-reveal>
          <div>
            <p className="eyebrow">GOLD</p>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div className="cta-actions">
            <Button to={to}>{button}</Button>
            {secondary ? <Button href={secondaryHref} variant="ghost">{secondary}</Button> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

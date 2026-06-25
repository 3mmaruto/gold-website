export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.12em] transition duration-300";
  const variants = {
    primary:
      "bg-brand-gold text-brand-navy hover:bg-[#d9ad4e] shadow-glow",
    secondary:
      "border border-white/20 bg-white/5 text-white hover:border-brand-gold hover:text-brand-gold",
    dark: "bg-brand-navy text-white hover:bg-brand-navy-soft",
  };

  const styles = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  return <button className={styles}>{children}</button>;
}

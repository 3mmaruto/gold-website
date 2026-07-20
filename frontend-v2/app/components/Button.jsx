import { Link } from "react-router";

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  className = "",
  download = false,
  ...props
}) {
  const classes = `button button--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} prefetch="intent" {...props}>
        <span>{children}</span>
        <span className="direction-arrow" aria-hidden="true">↗</span>
      </Link>
    );
  }

  return (
    <a className={classes} href={href} download={download || undefined} {...props}>
      <span>{children}</span>
      <span className="direction-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

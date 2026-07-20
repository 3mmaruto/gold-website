export default function BrandLogo({ alt = "GOLD", className = "" }) {
  return (
    <picture className={`brand-logo ${className}`.trim()}>
      <source
        type="image/avif"
        srcSet="/media/brand/gold-logo-new-4-160.avif 160w, /media/brand/gold-logo-new-4-320.avif 320w"
        sizes="80px"
      />
      <source
        type="image/webp"
        srcSet="/media/brand/gold-logo-new-4-160.webp 160w, /media/brand/gold-logo-new-4-320.webp 320w"
        sizes="80px"
      />
      <img src="/media/brand/gold-logo-new-4.png" alt={alt} width="160" height="160" />
    </picture>
  );
}

const media = {
  hero: {
    base: "/media/hero/gold-heat-pump-hero-v1",
    fallback: "/media/hero/gold-heat-pump-hero-v1.png",
    width: 1920,
    height: 1080,
  },
  products: {
    base: "/media/products/gold-products-family-v1",
    fallback: "/media/products/gold-products-family-v1.png",
    width: 1920,
    height: 1080,
  },
};

export default function ResponsivePicture({
  asset,
  source,
  alt,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  priority = false,
}) {
  const image = source ?? media[asset];
  const widths = image.widths ?? [768, 1280, 1920];
  const srcSet = (format) =>
    widths
      .map((width) => `${image.base}-${width}.${format} ${width}w`)
      .join(", ");

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        className={imgClassName}
        src={image.fallback}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

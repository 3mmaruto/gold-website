import catalogSource from "../data/products.json";
import { isSupportedLocale } from "./content";

function localized(value, locale) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[locale] ?? value.en ?? value.ar ?? "";
  }
  return value ?? "";
}

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .toLocaleLowerCase()
    .trim();
}

export function getCatalog(locale) {
  const safeLocale = isSupportedLocale(locale) ? locale : "ar";
  const categories = catalogSource.categories.map((category) => ({
    id: category.id,
    label: localized(category.label, safeLocale),
  }));
  const labelsByCategory = Object.fromEntries(
    categories.map((category) => [category.id, category.label]),
  );

  const products = catalogSource.products.map((product) => ({
    ...product,
    name: localized(product.name, safeLocale),
    summary: localized(product.summary, safeLocale),
    categoryLabel: labelsByCategory[product.category] ?? product.category,
    images: product.images.map((image) => ({
      ...image,
      alt: localized(image.alt, safeLocale),
      label: localized(image.label, safeLocale),
    })),
    specs: product.specs.map((spec) => ({
      label: localized(spec.label, safeLocale),
      value: localized(spec.value, safeLocale),
    })),
    highlights: product.highlights[safeLocale] ?? [],
  }));

  return {
    schemaVersion: catalogSource.schemaVersion,
    pageSize: catalogSource.pageSize,
    paginationThreshold: catalogSource.paginationThreshold,
    categories,
    products,
  };
}

export function queryCatalog({ locale, query = "", category = "all", page = 1 }) {
  const catalog = getCatalog(locale);
  const normalizedQuery = normalizeSearch(query);
  const validCategory = catalog.categories.some((item) => item.id === category)
    ? category
    : "all";

  const filteredProducts = catalog.products.filter((product) => {
    const categoryMatches = validCategory === "all" || product.category === validCategory;
    if (!categoryMatches) return false;
    if (!normalizedQuery) return true;

    const searchableText = normalizeSearch([
      product.name,
      product.summary,
      product.categoryLabel,
      ...product.specs.flatMap((spec) => [spec.label, spec.value]),
      ...product.highlights,
      ...(product.models ?? []),
    ].join(" "));

    return searchableText.includes(normalizedQuery);
  });

  const showPagination = filteredProducts.length > catalog.paginationThreshold;
  const totalPages = showPagination
    ? Math.max(1, Math.ceil(filteredProducts.length / catalog.pageSize))
    : 1;
  const requestedPage = Number.parseInt(page, 10);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const start = showPagination ? (currentPage - 1) * catalog.pageSize : 0;
  const visibleProducts = showPagination
    ? filteredProducts.slice(start, start + catalog.pageSize)
    : filteredProducts.slice(0, catalog.pageSize);

  return {
    ...catalog,
    category: validCategory,
    query,
    filteredProducts,
    visibleProducts,
    totalResults: filteredProducts.length,
    showPagination,
    totalPages,
    currentPage,
  };
}

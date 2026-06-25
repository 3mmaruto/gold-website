export const products = [
  {
    id: "heat-pump",
    slug: "heat-pump",
    categoryLabel: "Featured System",
    name: {
      en: "Heat Pump",
      ar: "المضخة الحرارية",
    },
    summary: {
      en: "A premium heating and cooling system positioned as the flagship product foundation for v2.",
      ar: "حل تدفئة وتبريد مميز يشكل أساس العرض الرئيسي لواجهة المنتجات الجديدة.",
    },
    highlights: [
      "DC inverter-oriented positioning from current source content",
      "Future-ready hero product candidate for an eventual 3D showcase",
      "Direct catalog support through the existing PDF asset",
    ],
    images: [
      "/media/hero/heat-pump-hero-01.JPG",
      "/media/hero/heat-pump-hero-02.JPG",
      "/media/products/heat-pump-hero-03.JPG",
    ],
    catalogPdf: "/catalog/catalog.pdf",
  },
  {
    id: "water-tank",
    slug: "water-tank",
    categoryLabel: "Support Product",
    name: {
      en: "Water Tank",
      ar: "خزان مياه",
    },
    summary: {
      en: "A supporting product entry based on current product imagery and existing static product content.",
      ar: "منتج داعم مبني على الصور الحالية ومحتوى المنتجات الموجود في الموقع الحالي.",
    },
    highlights: [
      "Existing product image available from current static site",
      "Good candidate for future structured technical specification tables",
      "Can later connect to catalog filters and product detail pages",
    ],
    images: ["/media/products/water-tank-01.JPG"],
    catalogPdf: "/catalog/catalog.pdf",
  },
];

import english from "../../../docs/content/site-content.en.json";
import arabic from "../../../docs/content/site-content.ar.json";

export const contentByLocale = { ar: arabic, en: english };
export const supportedLocales = ["ar", "en"];

export function isSupportedLocale(locale) {
  return supportedLocales.includes(locale);
}

export function getContent(locale) {
  return contentByLocale[isSupportedLocale(locale) ? locale : "ar"];
}

export function oppositeLocale(locale) {
  return locale === "ar" ? "en" : "ar";
}

export const ui = {
  ar: {
    menu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skip: "انتقل إلى المحتوى",
    learnMore: "اعرف المزيد",
    selectionCriteria: "معايير الاختيار",
    revealDetails: "إظهار تفاصيل الاختيار",
    hideDetails: "إخفاء تفاصيل الاختيار",
    catalogNote: "الكتالوغ بصيغة PDF",
    contactNote: "يفتح النموذج تطبيق البريد الإلكتروني لديك ولا يرسل البيانات إلى خادم خارجي.",
    optional: "اختياري",
    projectOptions: ["مبنى سكني", "مشروع تجاري", "مياه ساخنة", "مشروع آخر"],
    formSubject: "استفسار مشروع جديد - Gold Group",
    formIntro: "مرحباً، أود الاستفسار عن مشروع جديد.",
    copied: "تم نسخ البريد الإلكتروني",
    since: "منذ 2008",
    details: "التفاصيل",
    callNow: "اتصل الآن",
    emailUs: "راسلنا",
    breadcrumbHome: "الرئيسية",
    copyrightPrefix: "© 2026",
    landingTitle: "أنظمة مدروسة للراحة والطاقة",
    landingBody: "اختر اللغة لاستكشاف مضخات غولد الحرارية وحلول التدفئة والتبريد والمياه الساخنة.",
    enter: "الدخول إلى الموقع بالعربية",
    catalogEyebrow: "كتالوغ غولد",
    catalogTitle: "منتجات تعمل معاً ضمن منظومة واحدة.",
    searchProducts: "ابحث في المنتجات",
    searchPlaceholder: "ابحث بالمنتج أو الغاز أو الاستطاعة",
    filterProducts: "تصفية المنتجات حسب الفئة",
    allProducts: "جميع المنتجات",
    resultsLabel: "نتيجة",
    essentialSpecs: "المواصفات الأساسية",
    productHighlights: "التفاصيل ومعايير الاختيار",
    selectProduct: "اطلب مساعدة في الاختيار",
    clearFilters: "مسح البحث والفلاتر",
    emptyTitle: "لا توجد منتجات مطابقة حالياً.",
    emptyBody: "جرّب عبارة بحث أقصر أو اختر فئة أخرى.",
    cabinetConfigurations: "تكوينات الهيكل",
    pageLabel: "صفحة",
  },
  en: {
    menu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
    learnMore: "Learn more",
    selectionCriteria: "Selection criteria",
    revealDetails: "Reveal selection details",
    hideDetails: "Hide selection details",
    catalogNote: "PDF catalog",
    contactNote: "This form opens your email app. It does not send data to an external server.",
    optional: "optional",
    projectOptions: ["Residential building", "Commercial project", "Hot water", "Other project"],
    formSubject: "New project enquiry - Gold Group",
    formIntro: "Hello, I would like to enquire about a new project.",
    copied: "Email address copied",
    since: "Since 2008",
    details: "Details",
    callNow: "Call now",
    emailUs: "Email us",
    breadcrumbHome: "Home",
    copyrightPrefix: "© 2026",
    landingTitle: "Engineered systems for comfort and energy",
    landingBody: "Choose a language to explore GOLD heat pumps, heating, cooling and hot-water solutions.",
    enter: "Enter the website in English",
    catalogEyebrow: "GOLD catalog",
    catalogTitle: "Products designed to work as one system.",
    searchProducts: "Search products",
    searchPlaceholder: "Search by product, refrigerant or capacity",
    filterProducts: "Filter products by category",
    allProducts: "All products",
    resultsLabel: "results",
    essentialSpecs: "Essential specifications",
    productHighlights: "Details and selection criteria",
    selectProduct: "Ask for selection help",
    clearFilters: "Clear search and filters",
    emptyTitle: "No products match these filters yet.",
    emptyBody: "Try a shorter search term or choose another category.",
    cabinetConfigurations: "Cabinet configurations",
    pageLabel: "Page",
  },
};

export function getUi(locale) {
  return ui[isSupportedLocale(locale) ? locale : "ar"];
}

import documents from "../data/manufacturer-documents.json";

export function getManufacturerDocuments(locale) {
  return documents.map((document) => ({
    ...document,
    type: document.type[locale],
    title: document.title[locale],
    summary: document.summary[locale],
    alt: document.alt[locale],
  }));
}

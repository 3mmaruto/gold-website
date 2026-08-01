/** @type {import('@react-router/dev/config').Config} */
export default {
  ssr: false,
  prerender: [
    "/",
    "/ar/",
    "/ar/about/",
    "/ar/products/",
    "/ar/contact/",
    "/ar/manufacturer-documents/",
    "/ar/heat-pumps/",
    "/ar/underfloor-heating/",
    "/en/",
    "/en/about/",
    "/en/products/",
    "/en/contact/",
    "/en/manufacturer-documents/",
    "/en/heat-pumps/",
    "/en/underfloor-heating/",
  ],
  routeDiscovery: { mode: "initial" },
};

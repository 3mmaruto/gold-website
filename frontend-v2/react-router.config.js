/** @type {import('@react-router/dev/config').Config} */
export default {
  ssr: false,
  prerender: [
    "/",
    "/ar/",
    "/ar/about/",
    "/ar/products/",
    "/ar/contact/",
    "/ar/heat-pumps/",
    "/ar/underfloor-heating/",
    "/en/",
    "/en/about/",
    "/en/products/",
    "/en/contact/",
    "/en/heat-pumps/",
    "/en/underfloor-heating/",
  ],
  routeDiscovery: { mode: "initial" },
};

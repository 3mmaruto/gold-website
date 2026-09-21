import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/landing.jsx"),
  route(":locale", "./routes/locale-layout.jsx", [
    index("./routes/home.jsx"),
    route("about", "./routes/about.jsx"),
    route("products/hot-water-cylinders", "./routes/water-cylinders.jsx"),
    route("products/:productSlug", "./routes/product-detail.jsx"),
    route("products", "./routes/products.jsx"),
    route("contact", "./routes/contact.jsx"),
    route("manufacturer-documents", "./routes/quality-documents.jsx"),
    route(":solution", "./routes/solution.jsx"),
  ]),
];

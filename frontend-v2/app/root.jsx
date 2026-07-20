import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "react-router";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-700.css";
import "@fontsource/ibm-plex-sans-arabic/latin-400.css";
import "@fontsource/ibm-plex-sans-arabic/latin-500.css";
import "@fontsource/ibm-plex-sans-arabic/latin-600.css";
import "@fontsource/ibm-plex-sans-arabic/latin-700.css";
import JsonLd from "./components/JsonLd";
import { organizationJsonLd } from "./lib/seo";
import "./styles/global.css";

export function links() {
  return [
    { rel: "icon", type: "image/png", href: "/media/brand/gold-logo-new-4.png" },
  ];
}

export function Layout({ children }) {
  const { pathname } = useLocation();
  const locale = pathname === "/" ? "en" : pathname.startsWith("/ar") ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#071426" />
        <Meta />
        <Links />
        <JsonLd data={organizationJsonLd} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <main className="error-page">
      <p className="eyebrow">GOLD</p>
      <h1>{status}</h1>
      <p>The requested page could not be displayed.</p>
      <a className="button button--primary" href="/">
        Return to the language page
      </a>
    </main>
  );
}

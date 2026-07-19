import { Navigate, Outlet } from "react-router";
import MotionController from "../components/MotionController";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getContent, getUi, isSupportedLocale } from "../lib/content";

export default function LocaleLayout({ params }) {
  const locale = params.locale;

  if (!isSupportedLocale(locale)) {
    return <Navigate replace to="/ar/" />;
  }

  const content = getContent(locale);
  const ui = getUi(locale);

  return (
    <div className="site-shell">
      <MotionController />
      <SiteHeader locale={locale} content={content} ui={ui} />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter locale={locale} content={content} ui={ui} />
    </div>
  );
}

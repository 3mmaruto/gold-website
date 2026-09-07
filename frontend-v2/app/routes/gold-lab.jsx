import { Navigate } from "react-router";
import JsonLd from "../components/JsonLd";
import SeoLinks from "../components/SeoLinks";
import { getContent, isSupportedLocale } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";
import GoldLab from "../features/gold-lab/GoldLab";
import { LabLocale } from "../features/gold-lab/locale";
import "../features/gold-lab/gold-lab.css";

export function meta({ params }) {
  return buildMeta(params.locale, "goldLab");
}
export default function GoldLabPage({ params }) {
  const locale = params.locale;
  if (!isSupportedLocale(locale))
    return <Navigate replace to="/ar/gold-lab/" />;
  return (
    <>
      <SeoLinks locale={locale} page="goldLab" />
      <JsonLd
        data={breadcrumbsJsonLd(
          locale,
          "goldLab",
          getContent(locale).navigation.goldLab,
        )}
      />
      <LabLocale.Provider value={locale}>
        <GoldLab locale={locale} />
      </LabLocale.Provider>
    </>
  );
}

import { FiHome, FiZap } from "react-icons/fi";
import { LuFlame } from "react-icons/lu";
import { fmt } from "./energy-model";
import { useLabText } from "./locale";

export default function HouseComparison({ sample, area, running }) {
  const t = useLabText();
  return (
    <div className="gl-houses">
      {["hp", "diesel"].map((kind) => {
        const hp = kind === "hp";
        return (
          <article
            className={`gl-house-panel gl-${kind} ${running && sample.heat > 0.001 ? "gl-operating" : ""}`}
            key={kind}
            data-system={kind}
          >
            <div className="gl-house-heading">
              <div>
                <span className="gl-eyebrow">
                  {hp
                    ? t("البيت الأول", "House one")
                    : t("البيت الثاني", "House two")}
                </span>
                <h2>
                  {hp
                    ? t("مضخة غولد الحرارية", "GOLD heat pump")
                    : t("مرجل ديزل", "Diesel boiler")}
                </h2>
              </div>
              <span className={`gl-system-badge ${hp ? "gl-gold" : ""}`}>
                {hp ? <FiZap aria-hidden /> : <LuFlame aria-hidden />}
                {hp ? t("إنفرتر", "Inverter") : t("احتراق", "Combustion")}
              </span>
            </div>
            <div className="gl-thermal-scene">
              <div className="gl-equipment">
                {hp ? (
                  <img
                    src="/media/gold-lab/gold-r290.webp"
                    width="400"
                    height="435"
                    alt={t(
                      "مضخة غولد R290 مع ملصقات Danfoss وPanasonic",
                      "GOLD R290 heat pump with Danfoss and Panasonic labels",
                    )}
                  />
                ) : (
                  <LuFlame
                    className="gl-boiler-symbol"
                    strokeWidth={1}
                    aria-hidden
                  />
                )}
                <span dir={t("rtl", "ltr")}>
                  {hp ? (
                    <bdi>GOLD · R290</bdi>
                  ) : (
                    t(
                      "مرجل بالاستطاعة الحرارية نفسها",
                      "Boiler with the same heat output",
                    )
                  )}
                </span>
              </div>
              <div
                className="gl-flow-diagram"
                aria-label={t(
                  "حرارة مفيدة متساوية للبيتين",
                  "Equal useful heat supplied to both houses",
                )}
              >
                <div className="gl-hot-flow" />
                <strong>
                  <bdi data-metric="heat">{fmt(sample.heat, 2)}</bdi>
                  <small>{t("كيلوواط حراري", "kW of heat")}</small>
                </strong>
                <div className="gl-return-flow" />
              </div>
              <div className="gl-home-diagram">
                <FiHome strokeWidth={1} aria-hidden />
                <div className="gl-indoor-temperature">
                  <bdi data-metric="temperature">
                    {fmt(sample.temperature, 1)}°
                  </bdi>
                </div>
                <span dir={t("rtl", "ltr")}>
                  {t("المساحة", "Area")} <bdi>{fmt(area)}</bdi> {t("م²", "m²")}
                </span>
              </div>
            </div>
            <div className="gl-cost">
              <span>{t("تكلفة الطاقة حتى الآن", "Energy cost so far")}</span>
              <strong>
                <bdi data-metric="cost">
                  {fmt(hp ? sample.hpCost : sample.dieselCost)}
                </bdi>
                <small>{t("ل.س جديدة", "new SYP")}</small>
              </strong>
            </div>
            <div className="gl-house-meters">
              <div>
                <span>
                  {hp
                    ? t("الكهرباء المستهلكة", "Electricity used")
                    : t("الديزل المستهلك", "Diesel used")}
                </span>
                <strong>
                  <bdi data-metric="consumption">
                    {fmt(hp ? sample.electricity : sample.litres, 1)}
                  </bdi>
                  <small>{hp ? t("ك.و.س", "kWh") : t("لتر", "litres")}</small>
                </strong>
              </div>
              <div>
                <span>
                  {hp
                    ? t("السحب الكهربائي الآن", "Electrical input now")
                    : t("الحرارة المفيدة المتراكمة", "Useful heat delivered")}
                </span>
                <strong>
                  <bdi data-metric="energy">
                    {fmt(hp ? sample.power : sample.heatKwh, hp ? 2 : 1)}
                  </bdi>
                  <small>
                    {hp ? t("كيلوواط", "kW") : t("ك.و.س حراري", "kWh of heat")}
                  </small>
                </strong>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

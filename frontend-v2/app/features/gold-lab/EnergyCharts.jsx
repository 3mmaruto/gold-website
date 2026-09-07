import { useLabText } from "./locale";
import { fmt } from "./energy-model";
export default function EnergyCharts({ samples, hour }) {
  const t = useLabText();
  const maxCost = Math.max(
    1000,
    Math.ceil(Math.max(samples[720].dieselCost, samples[720].hpCost) / 10000) *
      10000,
  );
  const maxPower = Math.ceil(
    Math.max(...samples.slice(0, 25).map((x) => x.power)),
  );
  const w = 640,
    h = 210,
    left = 50,
    right = 615,
    top = 15,
    bottom = 173;
  const path = (rows, key, maxX, maxY) =>
    rows
      .map(
        (r, i) =>
          `${i ? "L" : "M"}${(left + (r.hour / maxX) * (right - left)).toFixed(2)},${(bottom - (r[key] / Math.max(1, maxY)) * (bottom - top)).toFixed(2)}`,
      )
      .join(" ");
  const costRows = samples.filter((_, i) => i % 12 === 0);
  return (
    <section
      className="gl-charts-grid"
      aria-label={t("منحنيات التشغيل والتكلفة", "Operating and cost curves")}
    >
      <article className="gl-chart-panel">
        <div className="gl-chart-title">
          <h3>
            {t("التكلفة المتراكمة طوال الشهر", "Cumulative energy costs")}
          </h3>
          <span>{t("ليرة سورية جديدة", "New Syrian pounds")}</span>
        </div>
        <div className="gl-chart-legend">
          <span className="gl-gold-dot">{t("غولد", "GOLD")}</span>
          <span className="gl-red-dot">{t("ديزل", "Diesel")}</span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={t(
            "التكلفة المتراكمة طوال 30 يوماً",
            "Cumulative cost over 30 days",
          )}
          style={{ direction: "ltr" }}
        >
          {[0, 0.5, 1].map((n) => (
            <g key={n}>
              <line
                x1={left}
                x2={right}
                y1={bottom - n * (bottom - top)}
                y2={bottom - n * (bottom - top)}
                stroke="#30434c"
              />
              <text
                x={left - 9}
                y={bottom - n * (bottom - top) + 4}
                textAnchor="end"
              >
                {fmt((maxCost * n) / 1000)}k
              </text>
            </g>
          ))}
          {[0, 10, 20, 30].map((d) => (
            <text
              key={d}
              x={left + (d / 30) * (right - left)}
              y={199}
              textAnchor="middle"
            >
              {d}
            </text>
          ))}
          <path
            d={path(costRows, "dieselCost", 720, maxCost)}
            className="gl-diesel-line"
          />
          <path
            d={path(costRows, "hpCost", 720, maxCost)}
            className="gl-hp-line"
          />
          <line
            x1={left + (hour / 720) * (right - left)}
            x2={left + (hour / 720) * (right - left)}
            y1={top}
            y2={bottom}
            stroke="#d2e0e6"
            strokeDasharray="4 5"
          />
        </svg>
        <p className="gl-chart-foot">
          {t(
            "الأيام · الخط العمودي يحدد الزمن الحالي، والمنحنيان يوضحان توقع التجربة كاملة.",
            "Days · The vertical line marks current time; both curves show the full projection.",
          )}
        </p>
      </article>
      <article className="gl-chart-panel">
        <div className="gl-chart-title">
          <h3>
            {t("من الإحماء إلى الاستقرار", "From warm-up to steady operation")}
          </h3>
          <span>{t("السحب الكهربائي · كيلوواط", "Electrical input · kW")}</span>
        </div>
        <div className="gl-power-summary">
          <bdi>{fmt(samples[0].power, 2)}</bdi>
          <span>{t("عند البداية", "at start")}</span>
          <i>←</i>
          <bdi>{fmt(samples[24].power, 2)}</bdi>
          <span>{t("بعد 24 ساعة", "after 24 hours")}</span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={t(
            "السحب الكهربائي المتوقع للمضخة خلال أول 24 ساعة",
            "Estimated heat pump electrical input over the first 24 hours",
          )}
          style={{ direction: "ltr" }}
        >
          {[0, 0.5, 1].map((n) => (
            <g key={n}>
              <line
                x1={left}
                x2={right}
                y1={bottom - n * (bottom - top)}
                y2={bottom - n * (bottom - top)}
                stroke="#30434c"
              />
              <text
                x={left - 9}
                y={bottom - n * (bottom - top) + 4}
                textAnchor="end"
              >
                {fmt(maxPower * n, 1)}
              </text>
            </g>
          ))}
          {[0, 6, 12, 18, 24].map((d) => (
            <text
              key={d}
              x={left + (d / 24) * (right - left)}
              y={199}
              textAnchor="middle"
            >
              {d}
            </text>
          ))}
          <path
            d={path(samples.slice(0, 25), "power", 24, maxPower)}
            className="gl-hp-line"
          />
        </svg>
        <p className="gl-chart-foot">
          {t(
            "الساعات · استجابة حرارية توضيحية للمبنى؛ ليست خريطة اختبار للضاغط.",
            "Hours · Illustrative building response; not a compressor test map.",
          )}
        </p>
      </article>
    </section>
  );
}

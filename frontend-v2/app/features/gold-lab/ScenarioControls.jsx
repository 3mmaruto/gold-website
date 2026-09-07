import { useEffect, useState } from "react";
import { tariffs, presets, ranges } from "./energy-model";
import { useLabText, LabParagraph } from "./locale";

function NumberField({
  value,
  label,
  min,
  max,
  step = 1,
  onChange,
  compact = false,
  id,
}) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => setRaw(String(value)), [value]);
  const commit = () => {
    const n = Number(raw);
    if (raw.trim() && Number.isFinite(n)) {
      const bounded = Math.max(min, Math.min(max, n));
      setRaw(String(bounded));
      if (bounded !== value) onChange(bounded);
    } else setRaw(String(value));
  };
  const input = (
    <input
      id={id}
      type="number"
      dir="ltr"
      min={min}
      max={max}
      step={step}
      value={raw}
      aria-label={compact ? label : undefined}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
  return compact ? (
    input
  ) : (
    <label className="gl-numeric-control">
      <span>{label}</span>
      {input}
    </label>
  );
}

export default function ScenarioControls({ settings: s, onChange, onPreset }) {
  const t = useLabText();
  const tariffNames = {
    home: t("منزلي · شريحتان", "Household · two tiers"),
    commercial: t("تجاري", "Commercial"),
    industrial: t("صناعي وحرفي", "Industrial & craft"),
    continuous: t("معفى من التقنين", "Exempt from rationing"),
    heavy: t(
      "صهر ودرفلة · معفى من التقنين",
      "Smelting & rolling · rationing-exempt",
    ),
  };
  const presetNames = {
    home: t("1 · شقة وتعرفة منزلية", "1 · Household apartment"),
    cold: t("2 · جو أبرد", "2 · Colder weather"),
    capacity: t("3 · نقص الاستطاعة", "3 · Capacity shortfall"),
  };
  const number = (key, label) => (
    <NumberField
      key={key}
      id={`gl-${key}`}
      value={s[key]}
      label={label}
      {...ranges[key]}
      onChange={(v) => onChange(key, v)}
    />
  );
  const range = (key, label, unit) => (
    <div className="gl-control" key={key}>
      <div className="gl-control-label">
        <label htmlFor={`gl-${key}`}>{label}</label>
        <div className="gl-range-heading">
          <NumberField
            compact
            id={`gl-${key}`}
            value={s[key]}
            label={label}
            {...ranges[key]}
            onChange={(v) => onChange(key, v)}
          />
          <bdi>{unit}</bdi>
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} ${t("— شريط الضبط", "— slider")}`}
        dir="ltr"
        {...ranges[key]}
        value={s[key]}
        onChange={(e) => onChange(key, Number(e.target.value))}
      />
    </div>
  );
  return (
    <section
      className="gl-controls-section"
      aria-labelledby="gl-controls-title"
    >
      <div className="gl-section-heading">
        <span className="gl-section-number">01</span>
        <div>
          <h2 id="gl-controls-title">
            {t(
              "ضع البيتين في الظروف نفسها",
              "Set the same conditions for both houses",
            )}
          </h2>
          <LabParagraph>
            {t(
              "تغيير المدخلات يعيد العداد إلى البداية ويحدّث المقارنة.",
              "Changing an input resets the clock and recalculates the comparison.",
            )}
          </LabParagraph>
        </div>
      </div>
      <div className="gl-preset-row">
        <span>{t("أمثلة مدققة:", "Verified examples:")}</span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onPreset(p.settings)}
            aria-pressed={Object.keys(p.settings).every(
              (k) => p.settings[k] === s[k],
            )}
          >
            {presetNames[p.id]}
          </button>
        ))}
      </div>
      <div className="gl-controls-grid">
        {range("area", t("مساحة الشقة", "Floor area"), "m²", 50, 250, 10)}
        {range(
          "outside",
          t("درجة الحرارة الخارجية", "Outdoor temperature"),
          "°C",
          -5,
          15,
        )}
        {range(
          "target",
          t("الحرارة الداخلية المطلوبة", "Target indoor temperature"),
          "°C",
          18,
          24,
        )}
        {range("cop", t("معامل الأداء الفعلي", "Effective COP"), "COP")}
      </div>
      <div className="gl-tariff-row">
        <label className="gl-tariff-label">
          {t("تعرفة الكهرباء", "Electricity tariff")}
          <select
            value={s.tariff}
            onChange={(e) => onChange("tariff", e.target.value)}
          >
            {tariffs.map((r) => (
              <option key={r.id} value={r.id}>
                {tariffNames[r.id]}
              </option>
            ))}
          </select>
        </label>
        {s.tariff === "home" ? (
          number(
            "cheapRemaining",
            t(
              "المتبقي من الشريحة الأولى · ك.و.س",
              "First-tier allowance left · kWh",
            ),
            0,
            300,
          )
        ) : (
          <div className="gl-rate-card">
            <span>{t("سعر الكيلوواط الساعي", "Price per kWh")}</span>
            <strong>
              {tariffs.find((r) => r.id === s.tariff)?.rate}{" "}
              <small>{t("ل.س جديدة", "new SYP")}</small>
            </strong>
          </div>
        )}
        {number(
          "dieselPrice",
          t("سعر لتر الديزل · ل.س جديدة", "Diesel price per litre · new SYP"),
          1,
          1000,
        )}
        {number(
          "efficiency",
          t("كفاءة المرجل الموسمية · %", "Seasonal boiler efficiency · %"),
          50,
          95,
        )}
      </div>
      <LabParagraph className="gl-tariff-note">
        {t(
          "المنزلي: 6 ل.س لأول 300 ك.و.س في دورة شهرين، ثم 14 ل.س لما يزيد. أدخل الرصيد المتاح للتدفئة بعد الاستهلاك المنزلي الآخر. الافتراض الابتدائي أن الشريحة الأولى مستهلكة؛ وتقع أيام التجربة كلها ضمن دورة واحدة بلا تجديد للرصيد.",
          "Household: 6 new SYP/kWh for the first 300 kWh of a two-month billing cycle, then 14. Enter the allowance left for heating after other household consumption. The default assumes no first-tier allowance remains. All 30 days fall in one billing cycle, without an allowance reset.",
        )}
      </LabParagraph>
      <details className="gl-advanced">
        <summary>
          {t(
            "تفاصيل الحمل والاستقرار الحراري",
            "Heat-load and thermal-response details",
          )}
        </summary>
        <div className="gl-advanced-grid">
          {number(
            "intensity",
            t("حمل التصميم · واط/م²", "Design heat load · W/m²"),
            30,
            150,
          )}
          {number(
            "initial",
            t("حرارة البداية · °م", "Starting temperature · °C"),
            10,
            24,
          )}
          {number(
            "thermalMass",
            t(
              "السعة الحرارية · واط ساعي/م²·كلفن",
              "Thermal capacity · Wh/m²·K",
            ),
            20,
            150,
          )}
        </div>
        <LabParagraph>
          {t(
            "حمل التصميم مرجعه داخل 21°C وخارج −5°C. السعة الحرارية افتراض للمبنى ومحتوياته. يُستخدم زمن استجابة توضيحي قدره 3 ساعات لتنظيم اقتراب الحرارة من المطلوب. القدرة المتاحة مفترضة ثابتة عند 16 kW؛ وللاختيار التنفيذي تُراجع قدرة الجهاز ومعامل أدائه عند حرارة الجو والماء الفعليتين.",
            "Design heat load is referenced to 21°C indoors and −5°C outdoors. Thermal capacity is an assumption for the building and its contents. An illustrative 3-hour response controls the approach to target temperature. Available heat output is assumed fixed at 16 kW; actual sizing must use the unit’s capacity and COP at the relevant air and water temperatures.",
          )}
        </LabParagraph>
      </details>
    </section>
  );
}

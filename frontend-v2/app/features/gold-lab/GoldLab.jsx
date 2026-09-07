import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiWind,
  FiThermometer,
  FiExternalLink,
} from "react-icons/fi";
import SimulationClock from "./SimulationClock";
import HouseComparison from "./HouseComparison";
import ScenarioControls from "./ScenarioControls";
import EnergyCharts from "./EnergyCharts";
import SourcesMethod from "./SourcesMethod";
import { defaults, simulate, sampleAt, fmt, HOURS } from "./energy-model";
import { useLabText, LabParagraph } from "./locale";
import { useSimulationTools } from "./use-simulation-tools";

export default function GoldLab({ locale }) {
  const t = useLabText();
  const [settings, setSettings] = useState(defaults),
    [hour, setHour] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(24);
  const samples = useMemo(() => simulate(settings), [settings]);
  const current = sampleAt(samples, hour, settings),
    last = samples[HOURS];
  const saving = last.dieselCost - last.hpCost,
    percent = last.dieselCost > 0 ? (saving / last.dieselCost) * 100 : 0;
  const capacityShortfall = last.temperature < settings.target - 0.2;
  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        delta = (now - previous) / 1000;
      previous = now;
      setHour((h) => Math.min(HOURS, h + delta * speed));
    }, 100);
    return () => clearInterval(timer);
  }, [running, speed]);
  useEffect(() => {
    if (hour >= HOURS) setRunning(false);
  }, [hour]);
  const apply = (s) => {
    setRunning(false);
    setHour(0);
    setSettings({ ...s });
  };
  const change = (key, value) => apply({ ...settings, [key]: value });
  useSimulationTools(settings, hour, apply, locale);
  return (
    <div className="gold-lab" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="gl-lab-shell">
        <header className="gl-site-header">
          <Link
            to={`/${locale}/`}
            className="gl-brand"
            aria-label={t("غولد — الصفحة الرئيسية", "GOLD — home")}
          >
            <img
              src="/media/brand/gold-logo-new-4.png"
              width="65"
              height="70"
              alt="GOLD GROUP"
            />
            <span>
              {t("مختبر غولد", "Gold Lab")}
              <small>GOLD GROUP · HEATING & COOLING</small>
            </span>
          </Link>
          <span className="gl-edition">
            {t(
              "بيانات الأسعار · 06 سبتمبر 2026",
              "Price reference · 06 September 2026",
            )}
          </span>
          <nav
            className="gl-header-links"
            aria-label={t("تنقل المختبر", "Lab navigation")}
          >
            <Link className="gl-home-link" to={`/${locale}/`}>
              {t("الرئيسية", "Home")}
            </Link>
            <Link
              className="gl-language"
              to={`/${locale === "ar" ? "en" : "ar"}/gold-lab/`}
              hrefLang={locale === "ar" ? "en" : "ar"}
              lang={locale === "ar" ? "en" : "ar"}
            >
              {locale === "ar" ? "English" : "العربية"}
            </Link>
          </nav>
        </header>
        <main id="main-content">
          <section className="gl-intro">
            <div>
              <span className="gl-eyebrow gl-gold-text">
                {t(
                  "تجربة تشغيل على مدار 30 يومًا",
                  "A 30-day heating simulation",
                )}
              </span>
              <h1>
                {t(
                  "بيتان. نفس الحرارة. فاتورتان مختلفتان.",
                  "Two houses. Equal heat. Different bills.",
                )}
              </h1>
            </div>
            <div className="gl-conditions">
              <span>
                <FiWind aria-hidden />
                <bdi>{settings.outside}°</bdi>
                {t("خارجًا", "outdoors")}
              </span>
              <span>
                <FiThermometer aria-hidden />
                <bdi>{settings.target}°</bdi>
                {t("مطلوب", "target")}
              </span>
            </div>
          </section>
          <LabParagraph className="gl-assumption-note">
            {t(
              "تقدير تعليمي لتكلفة الطاقة، بقدرة حرارية مفترضة 16 kW وظروف ثابتة. معامل الأداء والكفاءة قابلان للتعديل؛ ليست النتيجة وعداً بالتوفير أو بديلاً عن دراسة المشروع.",
              "An educational energy-cost estimate with an assumed 16 kW heat output limit and constant conditions. COP and boiler efficiency are adjustable; results are not guaranteed savings or a substitute for project design.",
            )}
          </LabParagraph>
          <SimulationClock
            hour={hour}
            running={running}
            speed={speed}
            onRun={() => {
              if (hour >= HOURS) setHour(0);
              setRunning((r) => !r);
            }}
            onReset={() => {
              setHour(0);
              setRunning(false);
            }}
            onFinish={() => {
              setHour(HOURS);
              setRunning(false);
            }}
            onSpeed={setSpeed}
          />
          <HouseComparison
            sample={current}
            area={settings.area}
            running={running}
          />
          {capacityShortfall && (
            <LabParagraph className="gl-capacity-alert" role="status">
              {t(
                "الهدف الحراري غير متحقق: الحمل يتجاوز القدرة المفترضة. يستقر البيتان قرب",
                "Temperature target not met: demand exceeds the assumed capacity. Both houses settle near",
              )}{" "}
              <bdi>{fmt(last.temperature, 2)}°C</bdi>{" "}
              {t("بدلاً من", "rather than")} <bdi>{settings.target}°C</bdi>.{" "}
              {t(
                "المقارنة هنا لنفس الحرارة المسلّمة، وليس لراحة مكتملة؛ يلزم رفع الاستطاعة أو خفض الفقد.",
                "This compares equal delivered heat, not full target comfort. More capacity or lower heat loss is required.",
              )}
            </LabParagraph>
          )}
          <section
            className={`gl-result-ribbon ${saving < 0 ? "gl-cost-worse" : ""}`}
            aria-label={t(
              "نتيجة المقارنة بعد 30 يوماً",
              "30-day comparison result",
            )}
          >
            <div className="gl-saving-number">
              {saving >= 0 ? (
                <FiArrowDownLeft aria-hidden />
              ) : (
                <FiArrowUpRight aria-hidden />
              )}
              <strong>
                <bdi data-result="saving">{fmt(Math.abs(percent), 1)}%</bdi>
              </strong>
              <span>
                {saving >= 0
                  ? t("انخفاض تكلفة الطاقة", "Lower energy cost")
                  : t("زيادة تكلفة الطاقة", "Higher energy cost")}
                <small>
                  {t("نتيجة تقديرية خلال 30 يومًا", "Estimated over 30 days")}
                </small>
              </span>
            </div>
            <div>
              <span>{t("فرق التكلفة", "Cost difference")}</span>
              <strong>
                <bdi data-result="difference">{fmt(Math.abs(saving))}</bdi>
                <small>{t("ل.س جديدة", "new SYP")}</small>
              </strong>
            </div>
            <div>
              <span>{t("غولد · 30 يومًا", "GOLD · 30 days")}</span>
              <strong>
                <bdi data-result="hp">{fmt(last.hpCost)}</bdi>
                <small>{t("ل.س", "SYP")}</small>
              </strong>
            </div>
            <div>
              <span>{t("ديزل · 30 يومًا", "Diesel · 30 days")}</span>
              <strong>
                <bdi data-result="diesel">{fmt(last.dieselCost)}</bdi>
                <small>{t("ل.س", "SYP")}</small>
              </strong>
            </div>
          </section>
          <ScenarioControls
            settings={settings}
            onChange={change}
            onPreset={apply}
          />
          <EnergyCharts samples={samples} hour={hour} />
          <section className="gl-method-section">
            <div className="gl-section-heading">
              <span className="gl-section-number">02</span>
              <div>
                <h2>
                  {t(
                    "من أين يأتي فرق الاستهلاك؟",
                    "Why does energy use differ?",
                  )}
                </h2>
                <LabParagraph>
                  {t(
                    "المضخة تنقل حرارة الهواء إلى الماء، والديزل يحوّل طاقة الوقود إلى حرارة.",
                    "The heat pump transfers energy from air to water. A boiler converts fuel energy into heat.",
                  )}
                </LabParagraph>
              </div>
            </div>
            <div className="gl-explanation-grid">
              <article>
                <h3>
                  {t("الإنفرتر يتبع الحاجة", "Inverter output follows demand")}
                </h3>
                <LabParagraph>
                  {t(
                    "يرتفع الطلب في بداية التسخين، ثم يقترب من الفقد الحراري للمبنى عند الاستقرار. تنخفض الاستطاعة المطلوبة تدريجياً وفق الحمل؛ منحنى التشغيل توضيحي وليس قياساً ميدانياً.",
                    "Warm-up can require extra heat. As the house stabilizes, output approaches its heat loss. The curve illustrates load-following control, not a measured compressor performance map.",
                  )}
                </LabParagraph>
              </article>
              <article>
                <h3>
                  {t(
                    "البافر يدعم الاستقرار",
                    "The buffer supports stable operation",
                  )}
                </h3>
                <LabParagraph>
                  {t(
                    "يساعد التخزين والعزل الحراريان على تقليل التقطيع واستقرار الجريان. لا تضاف نسبة توفير مستقلة للبافر؛ فائدته الفعلية تتحدد بالحجم والربط والتحكم.",
                    "Thermal storage and insulation can reduce cycling and support stable flow. No separate buffer saving is added to the calculation; its benefit depends on sizing, connections and controls.",
                  )}
                </LabParagraph>
              </article>
              <article>
                <h3>
                  {t("رقم أداء قابل للمراجعة", "COP is an explicit assumption")}
                </h3>
                <LabParagraph>
                  {t(
                    "القيمة الابتدائية COP 4.05 من نقطة أداء موديل غولد 16 kW عند هواء 7°C وماء ذهاب 35°C. عند تغيير الجو يبقى معامل الأداء افتراضاً تدخله بنفسك، ولا يتغير تلقائياً.",
                    "The starting COP of 4.05 references GOLD’s 16 kW model at 7°C air and 35°C supply water. When weather changes, COP remains your explicit input; it does not adjust automatically.",
                  )}
                </LabParagraph>
              </article>
            </div>
          </section>
          <SourcesMethod />
        </main>
        <footer>
          <img
            src="/media/brand/gold-logo-new-4.png"
            width="47"
            height="58"
            alt="GOLD"
          />
          <LabParagraph>
            {t(
              "مقارنة تكلفة طاقة التدفئة فقط. الأسعار بالليرة السورية الجديدة؛ 1 جديدة = 100 قديمة. لا تشمل ثمن الأجهزة أو الصيانة أو الرسوم أو المياه الساخنة المنزلية.",
              "Space-heating energy costs only. Prices are in new Syrian pounds: 1 new SYP = 100 old SYP. Equipment, maintenance, fees and domestic hot water are excluded.",
            )}
          </LabParagraph>
          <a href="#sources">
            {t("المصادر وطريقة الحساب", "Sources and method")}
            <FiExternalLink aria-hidden />
          </a>
        </footer>
      </div>
    </div>
  );
}

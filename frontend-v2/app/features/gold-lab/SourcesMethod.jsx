import { FiExternalLink } from "react-icons/fi";
import { useLabText, LabParagraph } from "./locale";

export default function SourcesMethod() {
  const t = useLabText();
  const sources = [
    [
      t(
        "شرائح الكهرباء المنزلية ودورة الشهرين",
        "Household electricity tiers and two-month cycle",
      ),
      t("سانا · أغسطس 2026", "SANA · August 2026"),
      "https://sana.sy/locals/2553528/",
    ],
    [
      t(
        "التعرفة التجارية والصناعية والفئات الخاصة",
        "Commercial, industrial and special tariffs",
      ),
      t("سانا · قرار وزارة الطاقة", "SANA · Ministry of Energy decision"),
      "https://sana.sy/locals/2318512/",
    ],
    [
      t(
        "تحويل الليرة القديمة إلى الجديدة",
        "Old-to-new Syrian pound conversion",
      ),
      t(
        "سانا · المرسوم 293 · 100 قديمة = 1 جديدة",
        "SANA · Decree 293 · 100 old = 1 new",
      ),
      "https://sana.sy/presidency/2364708/",
    ],
    [
      t(
        "سعر المازوت: 125 ليرة جديدة لليتر",
        "Diesel price: 125 new SYP per litre",
      ),
      t("نورث برس · 4 سبتمبر 2026", "North Press · 4 September 2026"),
      "https://npasyria.com/244582/",
    ],
    [
      t(
        "المحتوى الحراري للديزل والتحويل بين الوحدات",
        "Diesel heat content and unit conversions",
      ),
      t(
        "إدارة معلومات الطاقة الأمريكية · نحو 10.64 kWh/L",
        "U.S. EIA · approximately 10.64 kWh/L",
      ),
      "https://www.eia.gov/energyexplained/units-and-calculators/index.php",
    ],
    [
      t(
        "كيف تعمل المضخة الحرارية ومعامل الأداء",
        "How heat pumps work and their performance",
      ),
      t("وكالة الطاقة الدولية", "International Energy Agency"),
      "https://www.iea.org/reports/the-future-of-heat-pumps/how-a-heat-pump-works",
    ],
  ];
  return (
    <section id="sources" className="gl-sources-section">
      <details>
        <summary>
          {t(
            "المصادر والمعادلات وحدود المقارنة",
            "Sources, equations and comparison limits",
          )}
        </summary>
        <div className="gl-method-detail">
          <div>
            <h3>
              {t("ميزان الطاقة خطوة بخطوة", "The energy balance, step by step")}
            </h3>
            <LabParagraph>
              {t(
                "يُحسب فقد الحرارة من مساحة المبنى وحمل التصميم وفرق الحرارة. في كل دقيقة يستقبل البيتان كمية الحرارة نفسها، وتتحول إلى كهرباء أو ديزل بالمعادلتين:",
                "Heat loss is calculated from floor area, design heat load and temperature difference. Both houses receive equal useful heat each minute, converted to electricity or diesel through these equations:",
              )}
            </LabParagraph>
            <div className="gl-formula" dir="ltr">
              E = Q / COP
              <br />
              Diesel (L) = Q / (10.64 × η)
            </div>
            <LabParagraph>
              {t(
                "Q حرارة مفيدة بالكيلوواط الساعي، وη كفاءة المرجل ككسر عشري. قيمة 80% افتراض تشغيلي كلي قابل للتعديل، وليست مواصفة لمرجل بعينه. المحتوى الحراري للديزل تقريبي وعلى أساس القيمة الحرارية العليا (HHV)؛ أدخل كفاءة متوافقة مع الأساس نفسه، لا قيمة كفاءة على أساس LHV.",
                "Q is useful heat in kWh; η is boiler efficiency as a decimal. The default 80% is an adjustable overall operating assumption, not a specification of a particular boiler. Approximate diesel heat content uses a higher heating value (HHV) basis; efficiency must use the same basis, not an LHV-rated value.",
              )}
            </LabParagraph>
            <div className="gl-formula" dir="ltr">
              UA = area × design load / (1000 × 26)
              <br />C = area × thermal capacity / 1000
              <br />
              Heat loss = UA × (T − T outdoor)
              <br />C × ΔT / Δt = heat input − heat loss
            </div>
            <LabParagraph>
              {t(
                "UA بوحدة kW/K وC بوحدة kWh/K. زمن الخطوة دقيقة واحدة. المتحكم التوضيحي يطلب تعويض الفقد مع رفع الحرارة نحو المطلوب خلال زمن استجابة 3 ساعات، بين صفر و16 kW.",
                "UA is in kW/K and C in kWh/K. The time step is one minute. The illustrative controller requests heat-loss replacement plus a 3-hour response toward the target, capped between zero and 16 kW.",
              )}
            </LabParagraph>
            <LabParagraph>
              {t(
                "الكلفة المنزلية الإضافية: أول كمية ضمن الرصيد المتاح بسعر 6، والباقي بسعر 14. لا يفترض الحساب أن رصيد دورة الشهرين كله متاح للتدفئة.",
                "Incremental household cost charges the available first-tier allowance at 6, then 14 for the remainder. The full two-month allowance is not assumed available for heating.",
              )}
            </LabParagraph>
          </div>
          <div>
            <h3>
              {t(
                "ما الذي يمثله هذا المثال؟",
                "What does this model represent?",
              )}
            </h3>
            <LabParagraph>
              {t(
                "المقارنة تفترض توافر كهرباء الشبكة والديزل طوال فترة التشغيل. لا تشمل كهرباء مصدر احتياطي أثناء التقنين. لا تُحسب أحمال المضخات الخارجية وفواقد التوزيع؛ تُضاف عند إجراء دراسة مشروع تفصيلية.",
                "The comparison assumes grid electricity and diesel remain available throughout. Backup electricity during rationing, external pump consumption and distribution losses are not included; they must be added for a detailed project assessment.",
              )}
            </LabParagraph>
            <LabParagraph>
              {t(
                "مرجع أداء المنتج: كتالوغ غولد المقدم للندوة، موديل R290 16 kW؛ تدفئة 16 kW ودخل 3.95 kW ومعامل أداء 4.05 عند A7/6 · W30/35. الصورة لطراز غولد الحقيقي ذي الجسم المشترك بين فئتي 16 و22 kW وفق بيانات الشركة.",
                "Product reference: GOLD’s supplied seminar catalog, R290 16 kW model; 16 kW heating, 3.95 kW input and COP 4.05 at A7/6 · W30/35. The photo shows the actual GOLD cabinet shared by the 16 and 22 kW models according to the company.",
              )}
            </LabParagraph>
            <LabParagraph>
              {t(
                "لا تُضاف تخفيضات الإنفرتر والبافر كخصم منفصل إلى المعادلة. زمن الاستجابة والكتلة الحرارية افتراضان للعرض التعليمي. تغيير الجو يغيّر حمل المبنى؛ يتطلب اختيار COP مرجع أداء أو تقديراً هندسياً مناسباً.",
                "Inverter and buffer benefits are not added as separate discounts. Response time and thermal capacity are educational assumptions. Outdoor temperature changes building load; choosing COP requires a relevant performance source or engineering estimate.",
              )}
            </LabParagraph>
            <LabParagraph>
              {t(
                "يفترض النموذج غياب المكاسب الشمسية والداخلية، وثبات الجو طوال 720 ساعة. مرجل الديزل يتبع الحرارة المسلّمة نفسها بحد 16 kW؛ لا تُحاكى دورات حرق فعلية. لا يضمن هذا الحد قدرة الجهاز في كل الأحوال الجوية.",
                "Solar and internal heat gains are omitted and outdoor temperature is constant for 720 hours. The diesel boiler follows the same delivered heat, with the same 16 kW limit; actual burner cycling is not modeled. The limit is not a guaranteed unit capacity in every weather condition.",
              )}
            </LabParagraph>
          </div>
        </div>
        <div className="gl-source-links">
          {sources.map(([title, description, url]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
              <FiExternalLink aria-hidden />
            </a>
          ))}
        </div>
        <LabParagraph className="gl-source-date">
          {t(
            "مرجع الأسعار حتى 6 سبتمبر 2026. سعر المازوت مؤرخ في 4 سبتمبر ومنقول عن لجنة التسعير في التغطية المشار إليها. عدّل السعر عند صدور نشرة أحدث. هذه حسابات استهلاك طاقة، وليست عرض سعر ملزماً.",
            "Price reference as of 6 September 2026. The diesel rate is dated 4 September, reported from the pricing committee in the linked coverage. Update it when a newer bulletin is issued. These energy-use estimates are not a binding quotation.",
          )}
        </LabParagraph>
      </details>
    </section>
  );
}

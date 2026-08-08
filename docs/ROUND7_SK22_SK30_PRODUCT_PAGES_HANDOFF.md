# Round 7 — SK22 and SK30 product pages

## Purpose

Create two permanent, bilingual, pre-rendered product-detail pages from the scanned GOLD support guide supplied outside the repository:

- `/ar/products/sk22/`
- `/en/products/sk22/`
- `/ar/products/sk30/`
- `/en/products/sk30/`

These pages should improve product discovery and provide a useful technical reference without publishing the full scanned guide or turning the page into a long manual dump.

## Authoritative source

The current source for this round is the scanned paper guide in:

`../gold/صور لدليل الدعم معلومات اعمق/sk22,sk30/`

Use only clearly readable values from these scans. For this round, this source takes precedence over older repository notes where values differ. Do not infer or combine values from other refrigerant series, generated product renders, old tables, or marketing copy.

Relevant source pages:

- `RECTIFY_IMG_20260730_105731.jpg` — performance table.
- `RECTIFY_IMG_20260730_105737.jpg` — model dimensions.
- `RECTIFY_IMG_20260730_105756.jpg` — installation-clearance figure.
- `RECTIFY_IMG_20260730_105819.jpg` — hydronic and heating-system schematics.
- `RECTIFY_IMG_20260730_105923.jpg` — controller overview.
- `RECTIFY_IMG_20260730_112857.jpg` — guide cover and model illustrations.

Do not copy the raw scans wholesale into the repository. Create only the approved web-ready derivatives described below, preserving the engineering content exactly.

## Product facts approved for publication

### SK22

- Rated heating capacity: `22 kW`.
- Electrical options:
  - `220 V · 1Ph · 50 Hz`.
  - `380–415 V · 3N · 50 Hz`.
- Rated power input: `4.1 kW`.
- COP shown in the current guide: `4.26 W/W`.
- Maximum power input: `6.0 kW`.
- Maximum current:
  - `28.5 A` for the single-phase configuration.
  - `11.0 A` for the three-phase configuration.
- Refrigerant: `R410A`.
- Refrigerant charge: `3500 g`.
- Maximum working pressure:
  - high/exhaust side: `4.2 MPa`.
  - suction side: `2.8 MPa`.
- Required water flow: `≥ 3.8 m³/h`.
- Electrical protection class: `Class I`.
- Water protection class: `IPX4`.
- Ambient operating range stated in the guide: `−10 to 43°C`.
- Sound pressure stated at 1 m: `≤ 58 dB(A)`.
- Compressor type: `Twin-rotary DC inverter`.
- Fan: `DC motor fan · horizontal discharge`.
- Dimensions: `1140 × 470 × 970 mm` (`W × D × H`).
- Net weight:
  - `90 kg` single-phase.
  - `108 kg` three-phase.

### SK30

- Rated heating capacity: `30 kW`.
- Electrical supply: `380–415 V · 3N · 50 Hz`.
- Rated power input: `5.5 kW`.
- COP shown in the current guide: `4.25 W/W`.
- Maximum power input: `7.5 kW`.
- Maximum current: `13.5 A`.
- Refrigerant: `R410A`.
- Refrigerant charge: `4500 g`.
- Maximum working pressure:
  - high/exhaust side: `4.15 MPa`.
  - suction side: `2.8 MPa`.
- Required water flow: `≥ 5 m³/h`.
- Electrical protection class: `Class I`.
- Water protection class: `IPX4`.
- Ambient operating range stated in the guide: `−10 to 43°C`.
- Sound pressure stated at 1 m: `≤ 58 dB(A)`.
- Compressor type: `Twin-rotary DC inverter`.
- Fan: `DC motor fan · horizontal discharge`.
- Dimensions: `1140 × 470 × 1270 mm` (`W × D × H`).
- Net weight: `108 kg`.

## Claims that must not be published in this round

- Any outlet-water temperature not present in the verified performance table.
- Five-year warranty or any warranty period.
- Percentage energy-savings claims.
- Superlatives such as “best,” “highest efficiency,” or “maintenance-free.”
- Manufacturer, supplier, factory, patent, or certificate identity.
- Any rows whose scan alignment is ambiguous, including the evaporator/plastic-blade wording.
- Prices, availability, ratings, or stock claims.

## Page design

Use the existing GOLD visual system: deep navy, warm white, gold accents, editorial typography, square technical geometry, restrained motion, Arabic RTL and English LTR.

The page should feel like a concise technical dossier, not an e-commerce detail page and not a scanned manual viewer.

### 1. Product hero

- Breadcrumbs: Home → Products → model.
- Eyebrow: `GOLD · R410A · DC Inverter`.
- Large model name and localized title.
- Short, project-oriented introduction.
- Three proof values in a compact strip: capacity, guide-rated COP, required water flow.
- Use a source-preserving crop of the appropriate unit illustration from the guide cover. Do not use the current R32 or R290 generated renders.
- Primary CTA: contact the technical team.
- Secondary CTA: return to products.

### 2. At-a-glance technical profile

- A calm grid of the most useful selection values.
- Keep units LTR inside Arabic layout.
- SK22 electrical alternatives must be clearly separated; never present the two current values as one configuration.
- Include a small source note: values are taken from the current scanned support guide and final selection is confirmed against the unit label and project conditions.

### 3. System integration

- One concise paragraph explaining that the unit supplies a designed hydronic circuit and can be coordinated with compatible emitters such as underfloor-heating circuits or fan-coil units according to the project design.
- Use a cleaned, content-preserving crop of the heating schematic from `105819`.
- Do not turn the schematic into installation instructions. Add a clear note that design, installation, commissioning, and service are for qualified personnel.

### 4. Dimensions and placement

- Use the dimensions figure from `105737` as a real technical visual.
- Present model dimensions in text beside it so the page remains accessible and searchable.
- The scan-derived figure may show both models because it gives useful comparison context.
- If the clearance figure from `105756` is used, label it as a guide figure and do not reduce site-specific requirements to a universal rule.

### 5. Control and support

- Mention the LCD controller, scheduling shown in the guide, and Wi-Fi connection through Smart Life.
- Do not reproduce the long pairing walkthrough.
- A small controller crop from `105923` may be used only if it remains legible after a clean 90° rotation and crop.
- End with a support CTA, not a download of the raw scan.

### 6. Related model

- Show the other model in a compact related-product panel to strengthen internal linking.

## Final bilingual copy

### SK22 — Arabic

**Title:** مضخة غولد الحرارية SK22 باستطاعة 22 كيلوواط

**Intro:** مضخة حرارية هواء إلى ماء بإنفرتر DC لمشاريع التدفئة المائية التي تتطلب استطاعة اسمية تبلغ 22 كيلوواط، مع خيار تغذية أحادي الطور أو ثلاثي الطور وفق تجهيز المشروع.

**Technical profile heading:** بيانات SK22 الأساسية

**System heading:** تكامل مدروس مع المنظومة المائية

**System copy:** تعمل SK22 ضمن دارة مائية مصممة للمشروع، ويمكن تنسيقها مع دارات التدفئة الأرضية أو وحدات الفان كويل والمكونات الهيدروليكية المناسبة. يحدد التصميم النهائي التدفق، الضخ، الحماية وأحجام المكونات وفق حمل المبنى وظروف التشغيل.

**Dimensions heading:** الأبعاد ومتطلبات الموقع

**Dimensions copy:** أبعاد الهيكل الواردة في دليل الدعم هي 1140 مم عرضاً، 470 مم عمقاً و970 مم ارتفاعاً. يجب اعتماد موقع يسمح بتدفق الهواء والوصول الآمن إلى أعمال الفحص والخدمة.

**Control heading:** تحكم ومتابعة يومية أوضح

**Control copy:** يعرض دليل الدعم واجهة تحكم LCD لإدارة وضع التشغيل ودرجة المياه والجدولة، إضافة إلى الاتصال عبر Wi‑Fi باستخدام تطبيق Smart Life. تختلف الوظائف المتاحة بحسب إعداد الجهاز ووحدة التحكم المركبة.

**Source note:** القيم المنشورة من دليل الدعم المصوّر الحالي. تُراجع لوحة بيانات الجهاز وظروف المشروع قبل الاعتماد النهائي أو التركيب.

**Safety note:** التصميم والتركيب والتشغيل الأولي والصيانة أعمال ينفذها مختصون مؤهلون.

### SK22 — English

**Title:** GOLD SK22 22 kW air-to-water heat pump

**Intro:** A DC-inverter air-to-water heat pump for hydronic heating projects requiring 22 kW rated capacity, with single-phase and three-phase supply options to suit the project electrical design.

**Technical profile heading:** SK22 technical profile

**System heading:** Designed for hydronic system integration

**System copy:** SK22 works within a project-designed water circuit and can be coordinated with underfloor-heating circuits, fan-coil units and the appropriate hydraulic components. Final flow, pumping, protection and component sizing depend on the building load and operating conditions.

**Dimensions heading:** Dimensions and site planning

**Dimensions copy:** The support guide lists an enclosure size of 1140 mm wide, 470 mm deep and 970 mm high. The selected location must preserve airflow and safe access for inspection and service.

**Control heading:** Clearer everyday control

**Control copy:** The support guide shows an LCD interface for operating mode, water-temperature and schedule settings, together with Wi-Fi connection through the Smart Life app. Available functions depend on the fitted controller and unit configuration.

**Source note:** Published values are taken from the current scanned support guide. Confirm the unit nameplate and project conditions before final selection or installation.

**Safety note:** System design, installation, initial commissioning and service must be performed by qualified personnel.

### SK30 — Arabic

**Title:** مضخة غولد الحرارية SK30 باستطاعة 30 كيلوواط

**Intro:** مضخة حرارية هواء إلى ماء بإنفرتر DC للمشاريع ذات الأحمال الأكبر، باستطاعة اسمية تبلغ 30 كيلوواط وتغذية كهربائية ثلاثية الطور.

**Technical profile heading:** بيانات SK30 الأساسية

**System heading:** استطاعة أكبر ضمن منظومة متكاملة

**System copy:** تُدمج SK30 مع دارة مائية مصممة وفق حمل المشروع، سواء لتغذية دارات التدفئة الأرضية أو وحدات الفان كويل الملائمة. يعتمد الأداء الفعلي على درجات الحرارة والتدفق والتصميم الهيدروليكي وطريقة التحكم.

**Dimensions heading:** الأبعاد ومساحة التركيب

**Dimensions copy:** أبعاد الهيكل الواردة في دليل الدعم هي 1140 مم عرضاً، 470 مم عمقاً و1270 مم ارتفاعاً. يحتاج الجهاز إلى موقع مدروس يحافظ على حركة الهواء ويؤمّن الوصول للخدمة.

**Control heading:** تشغيل مجدول واتصال عبر Wi‑Fi

**Control copy:** تتيح واجهة LCD الظاهرة في الدليل متابعة إعدادات التشغيل ودرجة المياه والوقت، مع إمكانية الاتصال عبر Wi‑Fi باستخدام تطبيق Smart Life. تعتمد الوظائف النهائية على تجهيز الجهاز ووحدة التحكم.

**Source note:** القيم المنشورة من دليل الدعم المصوّر الحالي. تُراجع لوحة بيانات الجهاز وظروف المشروع قبل الاعتماد النهائي أو التركيب.

**Safety note:** التصميم والتركيب والتشغيل الأولي والصيانة أعمال ينفذها مختصون مؤهلون.

### SK30 — English

**Title:** GOLD SK30 30 kW air-to-water heat pump

**Intro:** A DC-inverter air-to-water heat pump for higher-load projects, with 30 kW rated capacity and a three-phase electrical supply.

**Technical profile heading:** SK30 technical profile

**System heading:** Higher capacity within an integrated system

**System copy:** SK30 is integrated with a water circuit designed for the project load, whether serving underfloor-heating circuits or suitable fan-coil units. Actual performance depends on temperatures, flow, hydraulic design and control strategy.

**Dimensions heading:** Dimensions and installation space

**Dimensions copy:** The support guide lists an enclosure size of 1140 mm wide, 470 mm deep and 1270 mm high. The unit needs a planned location that preserves airflow and service access.

**Control heading:** Scheduling and Wi-Fi connectivity

**Control copy:** The LCD interface shown in the guide supports operating, water-temperature and time settings, with Wi-Fi connection through the Smart Life app. Final functions depend on the fitted unit and controller configuration.

**Source note:** Published values are taken from the current scanned support guide. Confirm the unit nameplate and project conditions before final selection or installation.

**Safety note:** System design, installation, initial commissioning and service must be performed by qualified personnel.

## Discovery and navigation

- Do not add SK22 or SK30 as children of the existing R32 card; the verified guide identifies these models as R410A.
- Add a compact “Model technical profiles” section to the products page with two model cards and direct links.
- Add the same two links in a concise model-reference section on the heat-pumps solution page.
- Do not add two more primary-header navigation items.
- Keep the current catalog pagination behaviour unchanged.

## SEO requirements

- Four pre-rendered HTML routes.
- Unique localized title and meta description for each model.
- Canonical and complete `hreflang` pairs for each route.
- Product JSON-LD with `brand: GOLD`, `model`, `description`, model page URL and the real scan-derived illustration. No `Offer`, stock, price, aggregate rating, certification or warranty.
- BreadcrumbList with three levels: Home → Products → model.
- Add all four URLs to `sitemap.xml` with reciprocal Arabic/English alternates.
- Update the product ItemList so model cards point to their real detail-page URLs.
- All visible page content must be present in pre-rendered HTML before JavaScript.

## Asset requirements

Create source-preserving derivatives in a dedicated directory such as:

`frontend-v2/public/media/products/sk-series/`

Recommended assets:

- `gold-sk22-guide-unit.png` — clean crop of the single-fan SK22 illustration from `112857`, rotated correctly.
- `gold-sk30-guide-unit.png` — clean crop of the dual-fan SK30 illustration from `112857`, rotated correctly.
- `gold-sk22-sk30-dimensions.png` — cleaned crop of the dimension drawings from `105737`.
- `gold-sk22-sk30-hydronic-system.png` — cleaned crop of the heating-system schematic from `105819`.
- Optional: `gold-sk-controller.png` — cleaned, rotated controller crop from `105923` only if it remains readable.

Do not redraw the diagrams and do not use generative editing for engineering content. Crop, rotate, correct orientation and lightly normalize the real scan only. Generate WebP and AVIF variants using the repository image pipeline and preserve the approved PNG derivatives.

## Implementation and verification

- Reuse the existing React Router, components and visual tokens; create a shared product-detail template driven by localized model data.
- Preserve accessibility: one `h1`, meaningful headings, descriptive alt text, keyboard-accessible links, visible focus states and correct RTL/LTR handling.
- Mobile priority: verify at `390 px`.
- Laptop priority: verify at `1440 px`.
- Also run existing wider checks if the suite already covers them.
- Verify no horizontal overflow, no clipped units, no broken images, no console errors/warnings, and no hydration mismatch.
- Verify all existing routes plus the four new routes return `200` after the production build.
- Run image optimization, type generation, production build, formatting/linting and `git diff --check`.

## Git boundary for this round

- Work only on `feat/sk22-sk30-product-pages`.
- Commit and push that branch to `origin` when verification passes.
- Do not open, merge or close a pull request.
- Do not push or merge `main`.
- Do not deploy and do not change Cloudflare.
- Fetch the latest `origin/main` and verify that the feature branch can be merged cleanly; report the result without performing the merge.

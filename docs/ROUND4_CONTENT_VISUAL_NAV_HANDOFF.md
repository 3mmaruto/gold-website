# Gold Group Round 4 — Content, Visuals and Navigation Handoff

## Purpose

This round polishes the two solution pages added before deployment, corrects an ambiguous heat-distribution statement, adds a truthful inverter-energy story, introduces a professional underfloor-planning visual, replaces the primary R290 catalog visual, and makes the header scalable for future SEO pages.

The work must remain bilingual, data-driven, pre-rendered and fully accessible. Implement locally and verify before any commit or push.

## Repository state at handoff

- Working branch at review time: `redesign/static-frontend-upgrade`.
- The branch tree matches `origin/main`; it is behind only by the two merge commits already on `main`.
- The live site is healthy, but one post-deployment UI issue was confirmed and is included below.
- Start the implementation batch on a short-lived branch such as `improve/content-visual-navigation`, preserving these uncommitted handoff assets.
- Do not deploy, merge, push or change Cloudflare in this round unless the user explicitly authorizes it later.

## Source accuracy rules

1. In this website, avoid the Arabic word `المشعات` and the English word `radiators`. In hydronic engineering they can mean hot-water radiators, but the Arabic wording is too easy to confuse with electric-resistance heaters. The Gold system does not rely on electric-resistance coils as its normal heat-distribution method.
2. Describe only compatible hydronic distribution: underfloor circuits, fan-coil units and other correctly designed water-side terminal equipment.
3. Do not claim a fixed saving percentage, a guaranteed low electrical bill, or an unverified minimum input value.
4. The verified current sheets document these heat-pump capacities:
   - R290: 8, 12, 16 and 22 kW.
   - R32: 8, 12.5, 16 and 22 kW.
5. The company expects 32 and 50 kW models, but their sheets and availability are not yet in the repository. Do not add them to product specifications, structured data or the current catalog until they are verified.
6. The raw file named `gold/heat pumb 80 degre.jpeg` visibly carries `R32` and `Mitsubishi` markings. Despite its filename, it must not be presented as an R290 80 C product.

## Approved new assets

### Underfloor-planning visual

Use:

`frontend-v2/public/media/solutions/gold-underfloor-planning-v1.png`

It is a fully fictional floor plan generated from the mood of the supplied reference. It contains no customer identity, copied geometry, dimensions or project data. Display it as a planning illustration, not as an as-built engineering drawing.

Suggested Arabic alt:

`تصور تخطيطي افتراضي لدارات تدفئة أرضية مائية موزعة على الغرف ومتّصلة بمجمّع مركزي`

Suggested English alt:

`Illustrative hydronic underfloor-heating loop plan connected to a central manifold`

### R290 catalog visual

Use:

`frontend-v2/public/media/products/generated/gold-heat-pump-r290-80c-dual-fan-v2.png`

This is a clean standalone dual-fan cabinet based on the verified R290 product-sheet proportions. It intentionally contains no generated refrigerant, component-brand or technical stickers. Keep all product facts as accessible HTML outside the image.

Suggested Arabic alt:

`جهاز مضخة حرارية غولد من سلسلة R290 عالية الحرارة بهيكل مزدوج المروحة`

Suggested English alt:

`GOLD R290 high-temperature heat pump in a dual-fan cabinet`

Replace the primary image of catalog card 01 with this asset. Do not add an inset, collage or secondary picture to card 01. Do not delete the earlier image; it may remain as an approved home/solution visual.

Extend `scripts/optimize-images.mjs` to include `public/media/solutions`, and generate 480, 768 and 1200 px WebP/AVIF variants for both new PNG files while preserving the originals.

## Heat-pump page copy corrections

### Replace the ambiguous application copy

Arabic title:

`تدفئة المبنى`

Arabic body:

`تغذّي المضخة الحرارية شبكة مياه متوافقة، مثل دارات التدفئة الأرضية أو وحدات الفان كويل أو تجهيزات توزيع مائية مصممة للعمل مع درجة حرارة التغذية المطلوبة.`

English title:

`Space heating`

English body:

`Supplies compatible hydronic distribution such as underfloor circuits, fan-coil units and other water-side terminal equipment designed for the required supply temperature.`

### Replace the distribution-factor copy

Arabic title:

`تجهيزات توزيع الحرارة`

Arabic body:

`دارات التدفئة الأرضية ووحدات الفان كويل وتجهيزات التوزيع المائية المتوافقة مع درجات حرارة تشغيل المنظومة.`

English title:

`Heat-distribution equipment`

English body:

`Underfloor circuits, fan-coil units and compatible water-side terminal equipment selected for the system operating temperatures.`

### Add a new inverter-energy section

Place this section after the applications and before the series comparison. It should feel like a visual explanation of modulation, not a legal disclaimer and not a table of unverified consumption figures.

Arabic eyebrow:

`إدارة الطاقة بالإنفرتر`

Arabic title:

`استهلاك يتبع الحمل، لا تشغيل ثابت بأقصى قدرة.`

Arabic body:

`يرفع نظام الإنفرتر الاستطاعة عندما يكون الطلب الحراري مرتفعاً، ثم يخفض سرعة الضاغط والمروحة والتدوير تدريجياً مع اقتراب المنظومة من درجة الحرارة المطلوبة. لذلك يتغير السحب الكهربائي ضمن مجال تشغيل كل موديل بحسب حمل المبنى وحرارة الجو ودرجة ماء التغذية، بدلاً من البقاء عند قدرة واحدة طوال الوقت.`

Arabic closing line:

`النتيجة هي إدارة أذكى للطاقة الكهربائية مقابل الحرارة المفيدة التي ينقلها النظام إلى المبنى.`

Arabic steps:

1. `استجابة للطلب` — `ترتفع الاستطاعة عند بدء التشغيل أو ازدياد الحمل الحراري.`
2. `اقتراب من الدرجة المطلوبة` — `يخفّض الإنفرتر سرعة المكوّنات تدريجياً مع استقرار حرارة المنظومة.`
3. `تشغيل متوازن` — `يحافظ النظام على قدرته ضمن المجال الذي تتطلبه الظروف الفعلية.`

English eyebrow:

`Inverter energy management`

English title:

`Power that follows demand, not fixed maximum-output operation.`

English body:

`Full-inverter control raises output when heating demand is high, then progressively reduces compressor, fan and circulation speed as the system approaches its target temperature. Electrical input therefore varies within each model's operating range according to building load, outdoor conditions and required supply-water temperature instead of remaining fixed at one output level.`

English closing line:

`The result is smarter control of electrical input for the useful heat transferred into the building.`

English steps:

1. `Respond to demand` — `Output rises during start-up or when the thermal load increases.`
2. `Approach the target` — `Component speed reduces progressively as system temperature stabilizes.`
3. `Maintain balance` — `The system modulates within the range required by real operating conditions.`

Design direction: show a restrained three-stage load/modulation line or stepped visual made with HTML/CSS/SVG. It must not present fabricated numerical power values. Respect reduced-motion preferences.

## Underfloor-heating page expansion

Add the approved planning visual and the following process section after the overview, before the current system-integration cards.

Arabic eyebrow:

`من المخطط إلى التنفيذ`

Arabic title:

`كل دارة تبدأ بقرار محسوب قبل تغطية الأرضية.`

Arabic intro:

`سواء كانت شبكة التدفئة الأرضية منفذة مسبقاً أو ضمن نطاق تنفيذ غولد غروب، تبدأ المراجعة من مخططات المبنى والحمل الحراري وتركيب الأرضية ومناطق التحكم للتأكد من توافق الشبكة مع مصدر الحرارة.`

Arabic steps:

1. `ندرس المعطيات` — `نراجع أحمال الغرف والعزل وتركيب الأرضية وموقع المجمّع ومناطق التحكم المطلوبة.`
2. `نخطط الدارات` — `ننسّق مسافات الأنابيب وأطوال الحلقات ومساراتها والمناطق الطرفية بما يناسب كل مساحة.`
3. `ننفذ ونتحقق` — `تُنسّق التوصيلات وتُختبر الدارات ويُوثّق توزيعها قبل استكمال طبقات الأرضية.`

English eyebrow:

`From plan to installation`

English title:

`Every circuit begins with a considered decision before the floor is covered.`

English intro:

`Whether the underfloor network already exists or is included in GOLD Group's scope, review begins with the building plans, calculated load, floor build-up and control zones so the distribution network can be coordinated with the heat source.`

English steps:

1. `Study the inputs` — `Review room loads, insulation, floor construction, manifold position and required control zones.`
2. `Plan the circuits` — `Coordinate pipe spacing, loop length, routing and edge zones for each space.`
3. `Install and verify` — `Coordinate connections, pressure-test the circuits and document their routes before completing the floor build-up.`

The wording intentionally covers both company-installed and pre-existing networks. Do not imply that GOLD Group always performs the floor installation.

## Homepage capacity presentation

Replace the current proof item that visually reads as a fixed `8-22 kW` portfolio limit.

Approved current production wording:

- Arabic value: `استطاعات متعددة`
- Arabic label: `اختيار حسب احتياج المشروع`
- Arabic note: `تبدأ السلاسل الحالية الموثقة من 8 كيلوواط وتُختار الاستطاعة وفق الحمل وظروف التشغيل.`
- English value: `Multiple capacities`
- English label: `Selected for each project`
- English note: `The currently documented series start at 8 kW, with capacity selected around load and operating conditions.`

Do not add 32 or 50 kW to the current product catalog or product JSON-LD yet. If the business wants an advance announcement before receiving the sheets, add a clearly separate `قريباً / Coming soon` statement after explicit approval; never blend planned capacities into current verified specifications.

## Scalable navigation design

Replace the six independent desktop links with this information architecture:

1. Home
2. Solutions / الحلول
   - Heat Pumps / المضخات الحرارية
   - Underfloor Heating / التدفئة الأرضية
   - Future solution and SEO guide pages
3. Products
4. About
5. Contact
6. Language switch

### Desktop

- `Solutions` is a real button controlling a compact animated popover or small mega-menu, not a sidebar.
- Present child links as concise cards or rows with a title and one short description.
- Open on click and keyboard focus; hover may enhance but must not be the only interaction.
- Support `Enter`, `Space`, arrow/tab navigation, `Escape`, outside click and focus return.
- Use `aria-expanded`, `aria-controls` and an active state when a child solution route is open.
- Child destinations remain normal crawlable links.
- Avoid adding every future SEO page directly to the top bar.

### Mobile

- Keep the existing mobile menu, but group solution pages in an accessible accordion.
- Opening the accordion must not close the whole menu.
- Choosing a child link closes the menu and restores normal page scrolling.
- Never mirror the logo or imagery in RTL.

Store navigation groups in shared bilingual data so future pages require data changes rather than a new hard-coded header layout.

## Confirmed live bug: invisible empty search state

Direct navigation to:

`/ar/products/?q=zzzz-no-result`

renders `.catalog-empty` with `display: grid`, a valid 380 px box and correct text, but computed `opacity: 0`. The dynamic element is inserted after hydration and is not picked up by the current one-time reveal observer.

Preferred minimal fix: do not apply the generic `data-reveal` animation to the conditional empty state; it should be immediately visible and announced by the existing live region. A broader mutation-observer rewrite is unnecessary for this case.

Test the equivalent English URL and a category/query combination after the fix.

## Implementation shape

- Keep solution content in the Arabic and English JSON sources.
- Add optional structured blocks such as `energyManagement` and `planningProcess`; render them conditionally in the shared `solution.jsx` route.
- Keep the routes, canonical links, reciprocal hreflang, Open Graph, JSON-LD, sitemap and robots behavior intact.
- Update the R290 catalog image reference and product JSON-LD image through the normalized product data.
- Add responsive CSS using logical properties and the existing breakpoints/tokens.
- Any visible text belongs in content data, not hard-coded locale ternaries.

## Verification checklist

- Run image optimization and confirm each new PNG has 480/768/1200 WebP and AVIF variants.
- Run the production build and verify all 13 pre-rendered routes.
- Verify Arabic and English solution pages at 390, 768, 1440 and 1920 px.
- Verify the new dropdown/accordion with mouse, touch and keyboard.
- Verify `Escape`, outside click, focus order and active child state.
- Verify direct navigation and refresh for products with `?q=`, `?category=` and no-result queries.
- Confirm `.catalog-empty` is visible after direct navigation and after client-side filtering.
- Confirm card 01 uses the new full R290 dual-fan image with no inset.
- Confirm no page calls the R32/Mitsubishi raw image an R290 product.
- Confirm console and network are clean and no horizontal overflow appears.
- Do not commit, push or deploy until the user reviews the local result.

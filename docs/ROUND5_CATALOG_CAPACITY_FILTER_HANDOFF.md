# Gold Group Round 5 — Capacity, Catalog Filters and New Products

## Purpose

This is a focused follow-up to Round 4. Keep all existing Round 4 work and apply only the changes below.

## 1. Homepage capacity proof

The business has confirmed that 32 and 50 kW units are being manufactured and will join the range soon. For the homepage marketing proof strip, the user explicitly approves presenting the broader 8–50 kW range now.

This decision supersedes the Round 4 homepage-capacity wording only. It does not change the verified model lists on the R290 and R32 product cards until their new technical sheets arrive.

Use this compact content so the third proof cell keeps the same visual rhythm as the other cells.

Arabic:

- value: `8–50 kW`
- label: `مجال الاستطاعة الحرارية`
- note: `استطاعات متنوعة لتناسب مختلف الاحتياجات`

English:

- value: `8–50 kW`
- label: `Heating capacity range`
- note: `Multiple capacities for different project needs`

Do not use the long sentence about documented capacities in this proof cell. Keep the detailed existing 8/12/16/22 and 8/12.5/16/22 lists on the current product cards unchanged.

## 2. Confirmed catalog-filter rendering bug

The local Round 4 preview reproduces this sequence:

1. Select a category such as buffer tanks.
2. The URL becomes `?category=buffer-tanks`.
3. The correct filter button receives `aria-pressed=true`.
4. The correct single product card is present in the DOM.
5. Its computed style remains `opacity: 0` until page refresh.

The URL state and catalog query are correct. This is not a filtering-data bug. `CatalogProductCard` is dynamically mounted with the generic `data-reveal` attribute, while the current motion observer only handles elements present during its earlier observation pass.

Preferred fix:

- Remove the generic `data-reveal` behavior from dynamically filtered catalog product cards so every newly mounted card is visible immediately.
- Preserve the existing hover/focus/tap details interaction.
- A small card-entry transition is acceptable only if its default/final state is visible without relying on the global intersection observer.
- Do not introduce a mutation observer merely for this catalog case.

Verify transitions between at least three different categories without refresh, then verify the same URLs after refresh in Arabic and English.

## 3. New product category

Add one scalable bilingual catalog category:

- id: `pipes-accessories`
- Arabic label: `الأنابيب والإكسسوارات`
- English label: `Pipes & accessories`

Add two normalized catalog products under this category. The total catalog becomes eight entries, so numbered pagination must remain hidden under the existing threshold rule.

## 4. High-quality hydronic accessories

Use:

`frontend-v2/public/media/products/generated/gold-hydronic-accessories-v1.png`

Arabic:

- name: `إكسسوارات الأنظمة المائية`
- summary: `إكسسوارات ووصلات نحاسية عالية الجودة لاستكمال توصيلات المنظومة وتنظيم دارات المياه بصورة موثوقة.`
- essential spec 1: label `الخامة`; value `نحاس`
- essential spec 2: label `الاستخدام`; value `توصيل وتنظيم دارات المياه`
- highlights:
  - `جودة الخامة والتشطيب`
  - `دقة القلاوظ والتوصيلات`
  - `اختيار القطعة وفق وظيفة الدارة`
  - `التوافق مع ضغط وحرارة التشغيل المطلوبة`
- image alt: `مجموعة إكسسوارات ووصلات نحاسية للأنظمة المائية`

English:

- name: `Hydronic system accessories`
- summary: `High-quality brass accessories and connection fittings for completing system pipework and coordinating water circuits.`
- essential spec 1: label `Material`; value `Brass`
- essential spec 2: label `Purpose`; value `Water-circuit connection and control`
- highlights:
  - `Material and finishing quality`
  - `Accurate threads and connections`
  - `Component selection for each circuit function`
  - `Compatibility with required operating pressure and temperature`
- image alt: `Brass accessories and connection fittings for hydronic systems`

Do not identify a precise valve type or claim a certification that is not documented.

## 5. Corrugated stainless-steel pipes

Use:

`frontend-v2/public/media/products/generated/gold-corrugated-stainless-pipes-v1.png`

The user clarified that 15, 20 and 25 mm are pipe diameters, not wall thicknesses.

Arabic:

- name: `أنابيب ستانلس ستيل مرنة`
- summary: `أنابيب ستانلس ستيل مموجة وعالية الجودة لتوصيلات الأنظمة المائية، بأقطار متعددة تناسب متطلبات الدارة.`
- essential spec 1: label `الخامة`; value `ستانلس ستيل`
- essential spec 2: label `الأقطار المتاحة`; value `15 · 20 · 25 mm`
- highlights:
  - `مرونة تساعد في تنفيذ مسارات التوصيل`
  - `خامة ستانلس ستيل عالية الجودة`
  - `التوافق مع الوصلات المناسبة`
  - `اختيار القطر وفق التدفق ومتطلبات الدارة`
- image alt: `لفات أنابيب ستانلس ستيل مموجة ومرنة للأنظمة المائية`

English:

- name: `Flexible stainless-steel pipes`
- summary: `High-quality corrugated stainless-steel pipes for hydronic system connections, available in multiple diameters for different circuit requirements.`
- essential spec 1: label `Material`; value `Stainless steel`
- essential spec 2: label `Available diameters`; value `15 · 20 · 25 mm`
- highlights:
  - `Flexible routing for system connections`
  - `High-quality stainless-steel construction`
  - `Compatibility with the appropriate fittings`
  - `Diameter selection according to flow and circuit requirements`
- image alt: `Coils of flexible corrugated stainless-steel pipe for hydronic systems`

## 6. Images and optimization

The two new PNG assets are approved project-bound product visuals. They were generated from the raw company images as product-shape references and use the same navy studio direction as the current catalog.

- Preserve both PNG originals.
- The existing image-optimization scan of `public/media/products/generated` should automatically include them.
- Generate 480, 768 and 1200 px WebP and AVIF variants.
- Use responsive sources on the product cards and confirm AVIF loads in the browser.

## 7. SEO and structured data

- The normalized data layer and product ItemList JSON-LD should include both new entries automatically.
- Keep canonical URLs and hreflang unchanged; these are catalog entries, not new routes.
- Update the localized product-page metadata description only if necessary to mention pipes and accessories naturally, without keyword stuffing.
- Search must match both new products by Arabic/English name, material and `15`, `20`, `25` values.

## 8. Verification

- Run image optimization, type generation and the production build.
- Confirm all 13 pre-rendered routes remain present.
- Test category changes without refresh in Arabic and English.
- Test direct refresh with `?category=pipes-accessories`.
- Test queries for `ستانلس`, `إكسسوارات`, `stainless`, `accessories`, `15`, `20` and `25`.
- Confirm both new cards are visible, responsive and keyboard/touch accessible.
- Confirm pagination remains hidden with eight catalog entries.
- Verify the homepage proof cell is short and visually aligned at 390, 768, 1440 and 1920 px.
- Confirm console/network are clean and there is no horizontal overflow.
- Stop before commit, push, PR, deployment or Cloudflare changes.

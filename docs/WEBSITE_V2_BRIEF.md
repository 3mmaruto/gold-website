# Gold Group Website v2 Brief

## Creative direction

The new website should feel like a premium industrial product launch, not an HVAC template. The heat pump is the visual and narrative center of the company: a real engineered system presented with confidence, clarity, and controlled motion.

### Brand palette

- Deep navy: `#071426`
- Graphite: `#11151C`
- Metallic gold: `#C79A2B`
- Signal red: `#D71920`
- Thermal blue: `#1479D1`
- Warm ivory: `#F7F3E8`
- Galvanized steel: `#B8BCC4`

Gold and red come from the approved crown mark. Blue communicates cooling and technical depth. Red should be an accent, not a dominant page background.

### Typography

- English: Manrope or an equivalent modern industrial sans-serif.
- Arabic: IBM Plex Sans Arabic or an equivalent professional Arabic sans-serif.
- Avoid decorative serif typography for body copy.
- Maintain strong hierarchy, short line lengths, and comfortable Arabic line height.

### Motion

- Hero: subtle depth/parallax and light movement, not a heavy endless animation.
- Sections: short reveal transitions tied to scroll, with no excessive bouncing.
- Product cards: keyboard-accessible focus/hover elevation plus a compact spec reveal.
- Respect `prefers-reduced-motion`.
- Do not add a heavy 3D engine until a real optimized 3D model exists. Use the approved 3D-style product visual and layered motion for this phase.

## Approved visual assets

### Homepage hero

`frontend-v2/public/media/hero/gold-heat-pump-hero-v1.png`

Use it as a cinematic wide hero. The machine sits on the right and the left side is intentionally quiet for HTML copy. Keep the media position stable in both locales; align Arabic copy to the right inside the left content column so it does not cover the machine.

### Products family banner

`frontend-v2/public/media/products/gold-products-family-v1.png`

Use it to introduce the supporting product family: hot-water cylinders, buffer tanks, expansion vessels, and circulation pumps.

### Logo

`frontend-v2/public/media/brand/gold-logo-new-4.png`

Use the mark as supplied. Do not regenerate text inside the logo. Create optimized web variants while preserving the source PNG.

## Information architecture

### Home

1. Premium heat-pump hero.
2. Compact proof strip: up to 80 C outlet, full DC inverter, R290 line, integrated circulation package.
3. How the system works: captures heat from outdoor air and transfers it to water.
4. Why Gold: efficiency, integrated control, heating/cooling capability, local project support.
5. Selected technical snapshot for the 80 C R290 line, clearly scoped.
6. Supporting products teaser.
7. Company credibility since 2008.
8. Contact CTA.

### About Us

1. Company story since 2008.
2. Focus on heating and cooling systems in Syria.
3. Technical approach: product selection, system design, installation support, and after-sales coordination.
4. Values: clarity, system-level thinking, efficiency, and long-term performance.
5. No people/team gallery in this phase.

### Our Products

1. Products family banner.
2. Four category cards:
   - Hot-water cylinders
   - Buffer tanks
   - Expansion tanks
   - Circulation pumps
3. On hover/focus, reveal a short purpose statement and key selection criteria. Do not fabricate model-level specs.
4. Provide catalog CTA and contact-for-selection CTA.
5. Use real product images where they are strong; otherwise use the approved family render as the editorial anchor.

### Contact Us

1. Direct phone, landline, email, and Damascus location.
2. Accessible contact form with clear labels.
3. Frontend-only form must not pretend to submit successfully without a real endpoint. Use `mailto:` or clearly document the selected form service.
4. Map is optional and must not block page performance or consent requirements.

## Copy tone

- Technical but readable.
- Premium without inflated claims.
- Short, direct headlines.
- Avoid absolute claims such as "maintenance-free", "100%", or unqualified savings percentages.
- Where a number depends on test conditions, say so.

## Responsive behavior

- The same component tree supports both locales.
- Use logical CSS properties and locale-aware alignment.
- Do not mirror the product image or logo in RTL.
- Navigation, breadcrumbs, icon direction, and form alignment should respond to `dir`.
- On mobile, place copy before media in the DOM, keep the hero image legible, and avoid covering the fan with text.

## Accessibility

- One clear `h1` per page.
- Meaningful alt text in the page language.
- No hover-only information: the product spec reveal must also work on focus/tap.
- Visible focus states and keyboard-operable language switch.
- Color is never the only carrier of heating/cooling meaning.

# Cylinder cinematic media — 2026-09-28

## Scope and source handling

Four project-bound raster assets generated with the **built-in ImageGen tool** (not CLI). The hero uses the approved real cylinder photograph as the edit target and the existing heat-pump hero only as a lighting reference. The other three images use the privately supplied engineering sheet as reference. Raw PDFs, their rendered scans, supplier contacts and rejected drafts are not published.

The technical images are illustrative renderings, not dimensionally accurate CAD or installation instructions. Materials, finishes and lighting are artistic. All specifications remain accessible bilingual HTML and the verified 120/200 L table remains unchanged. Larger capacities have no new detailed claims. Insulation 40/60/50 mm is also expressed as 4/6/5 cm in the leader notes; enamel stays in mm. Images are not evidence of testing or certification.

## Visual QA decisions

- Accepted the new studio hero and three detail images after inspecting them against the supplied references.
- Rejected the initial full cutaway: it added top fittings and a misleading half-full waterline. Regenerated it with three upper ports and a filled-volume tint.
- Physical image/leader coordinates do not mirror with RTL; note text does. No technical text is baked into the images.
- Original product photograph and previous cutaway remain available in repository history/assets; no source was destructively overwritten.
- Responsive WebP/AVIF derivatives are generated from the four original PNGs. No animation dependency added.

## Scroll annotations

Three figures each have two HTML labels, physical anchor points and SVG leader lines. IntersectionObserver triggers one short reveal on first visibility. No pinning, scroll hijack or repeated autoplay. Content remains present without JavaScript or observer support; reduced-motion preference bypasses the reveal. At <=1000 px, notes sit below the image and leaders follow a separate narrow-screen path.

## Final assets and prompt set

### hero

`frontend-v2/public/media/products/water-cylinders/gold-cylinder-studio-v1.png`

```text
Use case: precise-object-edit. Asset: premium GOLD hot-water cylinder product hero, portrait 4:5 composition. Image 1 is the product edit target; image 2 is lighting/art-direction reference ONLY, do NOT include the heat pump. Replace the crude pitch-black background of image 1 with an elegant cinematic industrial studio: brushed steel and slate-blue curved cyclorama, softly lit champagne floor, a subtle warm gold rim and cool blue rim, realistic soft contact shadow and restrained reflection. Preserve the EXACT cylinder silhouette, tall slim proportions, white enamel casing, existing dark cap and base, visible front GOLD crown printed mark and all physical fittings; do not redesign the product, add a screen, add legs, or invent ports. Retouch noise and improve nuanced studio lighting on the existing white product, keep the supplied product identity. Full cylinder visible with breathing space, fill most of frame, no cropping of cap/base. Sharp premium advertising photography, physically credible matte materials, luminous elegant backdrop, not a black cutout. No extra labels, headlines, logos, badges, text overlays, humans, flames, smoke or staged pipes. Keep brand mark as supplied, no invented lettering. Final polished production-ready website image.
```
### cutaway

`frontend-v2/public/media/products/water-cylinders/cylinder-section-studio-v1.png`

```text
Use case: sketch-to-render / scientific-educational. Create a premium cinematic 3D engineering illustration based STRICTLY on the main longitudinal cross-section in the supplied single-page engineering drawing. The reference is sideways; read it rotated so the cylinder lies horizontally with service/heater end on the LEFT and domed end on RIGHT. Landscape 3:2. Show one complete horizontal jacketed hot-water storage cylinder in a clean slightly elevated three-quarter sectional view. Preserve the source structural logic: thin outer casing, thick surrounding insulating layer shown as finely textured warm-gold foam, separate slim heat-exchange water jacket outside the inner tank, smooth enamel-lined inner tank with rounded end; a straight U-return electric heating element entering from the left midway, and the lower internal straight water pipe extending toward the right. Match visible port positions from the main source diagram: hot outlet upper-left end, cold inlet lower-left end, circulation inlet lowest-left end, outlet near far lower side; three SMALL separate upper ports for T&P, safety-liquid inlet and air vent. No helical coil, no invented compressor/pump, no extra machinery. Use metallic silver edge detail, subtle blue lining, restrained translucent aqua water to explain separation, gold foam. Elegant slate/navy studio background with soft warm and cool rim lighting, ambient shadows, full object floating just above a neutral engineering plinth. Accurate legible geometry takes priority over decoration. No dimension numbers, no labels, no text, no arrows or callouts; exact bilingual technical descriptions will be typeset as HTML alongside. A sophisticated educational cutaway, not a replacement installation drawing. High-detail premium product storytelling.
```

Final corrective edit prompt (selected output):

```text
Edit image 1 only; image 2 is the engineering reference. KEEP the cinematic materials, foam, blue enamel, camera angle and studio. Correct technical topology: exactly THREE upper small ports total, at roughly 18%, 29%, and 84% of tank length (T&P, safety, air vent). Remove both the large red upper-left and large red upper-right fittings entirely; relocate the rightmost of the three little ports toward far right. Keep hot outlet upper LEFT END, cold inlet lower LEFT END, circulation inlet lowest LEFT END, far-right lower circulation outlet. No new ports. Do NOT show a half-full air/water interface: use a subtle transparent blue cutaway tint across the FULL inner volume, as it is a pressurized filled vessel, no waves or horizontal water level. Keep inner tank wall, separate surrounding jacket and thick insulation clearly separated. Keep simple U-return electric element from left and lower straight pipe. Remove perforations from pipe tip and decorative red/green fittings collars: use simple neutral metallic fittings. No labels, text, numbers, arrows. This is a conceptual sectional rendering, not a dimensional installation plan. Preserve everything else.
```

### insulation

`frontend-v2/public/media/products/water-cylinders/cylinder-insulation-studio-v1.png`

```text
Use case: scientific-educational. Asset: cinematic macro image explaining a hot-water cylinder wall cross-section. Use supplied engineering drawing as structural reference only; focus on a SINGLE curved cut edge of its tank wall, not the whole drawing. Landscape 3:2 composition. Render a clean magnified wedge revealing ordered layers: an extremely thin smooth blue enamel coating on the inner steel tank wall, steel substrate, a narrow separate heat-exchange jacket outside the steel tank, thick warm-gold insulating foam beyond the jacket, and thin pearl-white/metallic external casing. Do not draw insulation in contact with potable water; the intact steel wall separates it. Distinguish thin enamel from thick insulation without pretending this artistic magnification is to scale. Finely textured foam, crisp steel edges and delicate enamel specular highlights; cool slate-blue background with champagne reflected light and soft shallow depth of field but every layer at the cut face sharply readable. Refined cinematic industrial editorial, visually engaging material study, no black cutout background. NO numbers, labels, arrows, typography, logo, charts, extra layers, helical coil, sparks or claims; dimensional values are external HTML and will remain exactly those in source tables. No mechanism invented. One coherent close-up.
```

### service

`frontend-v2/public/media/products/water-cylinders/cylinder-service-studio-v1.png`

```text
Use case: sketch-to-render / scientific-educational. Asset: premium cinematic technical illustration of the circular service end of the hot-water cylinder in the supplied drawing. Landscape 3:2, mostly front-on with a restrained three-quarter angle. The supplied sheet is sideways; use the circular end-view drawing as the GEOMETRY reference. Preserve the layout of the circular end-view: central rounded triangular electric-heater access flange, hot-water outlet near 12 o'clock, one lateral liquid inlet on each side, cold-water inlet and circulation inlet stacked near 6 o'clock, magnesium-anode port offset upper-left of the central flange. Render clean pearl-white end casing, a softly brushed metal central flange with understated real fasteners, accurately separated threaded metallic connection bosses. It is a visualized service-end detail, NOT a view of installed valves or exposed electrical wiring; no safety valve handles, no wires, no pumps, no new controls or extra ports. Include a restrained rim reveal of the outer insulation edge only where it matches a section boundary; avoid exploding parts. Slate/steel gradient studio background, fine cool-blue rim light and soft champagne key light, minimal and meticulously crafted like a premium industrial product launch. Match reference topology, no borrowed product. All explanatory port names and sizes will be displayed in real HTML beside the image, so NO text, dimensions, letters, labels, numerical values, arrows, badges or logos in the image. Full circular end assembly visible with comfortable margins, highly detailed, not a schematic scan.
```

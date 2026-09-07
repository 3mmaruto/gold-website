# Gold Lab energy-model validation

Gold Lab compares two otherwise identical homes receiving the same useful heat: one supplied by a heat pump and the other by a diesel boiler. The model is an illustrative, one-zone energy balance. It is not a building-load calculation, seasonal performance certificate, or measured compressor map.

## Model and units

- Design heat-loss coefficient: `UA = area × design intensity / (1000 × 26)` in kW/K. The entered W/m² intensity is referenced to 21 °C indoors and -5 °C outdoors.
- Effective thermal capacity: `C = area × thermal mass / 1000` in kWh/K.
- One-minute balance: `T(next) = T + (heat - UA × (T - Tout)) / (60 × C)`.
- Requested useful heat is the loss plus a three-hour proportional recovery term, limited to 0–16 kW of heat.
- Heat-pump electricity: `E = Q / COP`.
- Diesel volume: `L = Q / (10.64 × efficiency)`.

The diesel input of 10.64 kWh/L is treated as a higher-heating-value (HHV, or gross calorific value) assumption. An 80% boiler efficiency therefore means that 80% of that same HHV reaches the building as useful heat: `10.64 × 0.80 = 8.512 kWh/L`. An efficiency quoted on a lower-heating-value basis must be converted before it is substituted; HHV and LHV bases must not be mixed.

For household electricity, `R` is the unused part of the first 300 kWh in the two-month billing cycle. Incremental heating cost is `6 × min(E,R) + 14 × max(E-R,0)` new SYP. The simulator does not silently renew this allowance during its 30-day run. Commercial and ordinary industrial energy use 14 new SYP/kWh; the continuous-supply and heavy-industry options use their separately configured flat rates.

## Independently checked 720-hour cases

| Case | Final temperature | Useful heat Q | HP electricity | Diesel | HP energy cost | Diesel cost | Saving vs diesel |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home: 100 m², 7 °C outside, 15→21 °C, COP 4.05, R=150 kWh | 21.000 °C | 2,932.500 kWh | 724.074 kWh | 344.514 L | 8,937.04 new SYP | 43,064.20 new SYP | 79.247% |
| Cold commercial: 100 m², 0 °C outside, starts at 21 °C, COP 3.2 | 21.000 °C | 4,361.538 kWh | 1,362.981 kWh | 512.399 L | 19,081.73 new SYP | 64,049.85 new SYP | 70.208% |
| Capacity limit: 250 m², -5 °C outside, 15→21 °C requested, COP 3.0 | 17.187 °C | 11,520.000 kWh | 3,840.000 kWh | 1,353.383 L | 53,760.00 new SYP | 169,172.93 new SYP | 68.222% |

In the home case, thermal output starts at 12.308 kW and settles at 4.038 kW; electrical input moves from 3.039 kW to 0.997 kW. The first 150 kWh of heat-pump electricity are priced at 6 new SYP/kWh and the remaining 574.074 kWh at 14.

The cold commercial case starts at its target temperature, so there is no net storage-energy change. Its constant 6.058 kW useful output exactly balances the modeled transmission loss; heat-pump input is 1.893 kW throughout.

The 250 m² case requires 18.75 kW at its 21/-5 °C design condition, exceeding the 16 kW thermal cap by 2.75 kW. Both systems therefore remain at 16 kW and settle near 17.187 °C. This preset demonstrates undersizing and equal delivered heat, not successful 21 °C comfort. At 75 W/m², 16 kW covers at most about 213.3 m² at the stated design condition.

## Guardrails and test coverage

The shared ranges match the Gold Lab UI. Settings must be finite, supported, and inside those bounds before simulation; invalid COP, boiler efficiency, thermal mass, area, tariff, or non-finite energy values are rejected. Interpolated household costs are recalculated from interpolated electricity so a sample cannot draw a straight line through the tariff breakpoint. Tests also cover tariff boundaries, conservation identities, all-finite samples, capacity limiting, and a deliberately unfavorable scenario in which the displayed saving is negative.

Run from the repository root with Node 24:

```text
node --experimental-strip-types --test frontend-v2/tests/gold-lab-model.test.mjs
```

## Interpretation limits

Outdoor temperature and COP remain constant for each 30-day run. The 16 kW limit is treated as available thermal output at every selected condition. The model omits domestic hot water, auxiliary heaters, pumps outside the quoted conversion assumptions, defrost cycles, solar and internal gains, maintenance, capital cost, and tariff taxes or fees. The three-hour recovery term is a transparent illustrative controller assumption, not a measured inverter characteristic or an additional saving factor.

## Implementation and repeatable checks

The official implementation is a standalone React Router route at `/ar/gold-lab/` and `/en/gold-lab/`. Both are pre-rendered HTML, with one shared component tree under `frontend-v2/app/features/gold-lab/`. The language link preserves the current scenario and clock during client navigation; a fresh page load starts a new default scenario. There is no backend or personal-data collection.

The feature directory separates the physical model, presets, scenario inputs, clock, house meters, charts, localized reading-direction helper and source notes. Styles are scoped to `.gold-lab` and `gl-` class names. The approved equipment image is in `public/media/gold-lab/`. The earlier Sites prototype is not deployed and is not a runtime dependency.

From `frontend-v2`, on a supported Node runtime:

```text
npm ci
npm run typecheck
npm run test:gold-lab
npm run build
npm run test:gold-lab:build
```

The model suite contains nine checks; the build suite contains six, including both locales, canonical/hreflang, all 25 pre-rendered routes, sitemap agreement and local assets. The browser review covers 390px and 1440px viewports, the three presets, numeric input changes, negative savings, clock completion, start/pause and language-switch state preservation. Review the deployed pages after the existing GitHub Pages workflow completes.

The 18 new SYP/kWh category is specifically metal smelting/rolling **exempt from rationing**, not all metal industry. The price reference is 6 September 2026; the diesel quote is dated 4 September. Linked sources and the HHV assumption are shown in both page languages. Update dated prices when a new bulletin appears.

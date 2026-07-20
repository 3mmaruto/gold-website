# Gold Group Website Project Context

Updated: 2026-07-20

## Repository state

- Remote: `https://github.com/3mmaruto/gold-website`
- Default/deployed branch: `main`
- Redesign branch: `redesign/static-frontend-upgrade`
- Local checkout is on the redesign branch.
- Remote comparison: the redesign branch is one commit ahead of `main` and zero commits behind.
- `main` remains the current production source until v2 is fully approved.

## Workspace layout

```text
gold_group/
├── gold/                 # Raw company sources, read-only by default
└── gold-website/         # Git repository
    ├── frontend-v2/      # Production React Router application
    ├── docs/             # Shared context and verified content
    └── .github/          # GitHub Pages deployment workflow
```

## Current v2 state

`frontend-v2/` is the completed replacement application. It uses React Router framework mode with `ssr: false`, shared bilingual components, valid UTF-8 JSON content, localized metadata, responsive media, and static pre-rendering. The legacy root template and its obsolete assets were removed during the approved migration.

## Verified business facts used for website copy

- Company name shown publicly: `GOLD` / Gold Group.
- Location: Damascus, Syria.
- Company activity: heating, cooling, heat-pump systems, hot-water cylinders, tanks, and circulation equipment.
- Company catalog states an operating history since 2008.
- Contact phone: `0948529207`.
- Landline: `011 233 4005`.
- Email: `sk.group@windowslive.com`.

## Verified 80 C R290 line facts

Source: `../gold/SK 80C R290 FULL DC INVERTER HEAT PUMP 2026.pdf`.

- Models: 8, 12, 16, and 22 kW heating capacities.
- Maximum outlet water temperature: 80 C.
- Refrigerant: R290, listed GWP 3.
- Full-inverter Panasonic compressor.
- Danfoss plate heat exchanger and Danfoss EEV.
- Built-in inverter circulation pump and built-in expansion tank.
- Wi-Fi control and LCD controller.
- Rated COP values range from 4.00 to 4.33 depending on model and stated test conditions.
- Operating ambient temperature is listed as -7 C to 45 C on this sheet.

These values must not be generalized to every Gold product line without a matching source sheet.

## Target outcome

The production website contains six localized page families in both languages:

- Home
- About Us
- Our Products
- Contact Us
- Heat Pumps
- Underfloor Heating

Together with the `/` language-selection page, the build pre-renders 13 routes. The homepage centers the heat-pump system and links to useful solution guides rather than exposing proprietary manufacturing detail.

// All physical and price assumptions live here, independently of the interface.
export type Tariff =
  | "home"
  | "commercial"
  | "industrial"
  | "continuous"
  | "heavy";

export type Settings = {
  area: number;
  intensity: number;
  outside: number;
  target: number;
  initial: number;
  cop: number;
  efficiency: number;
  dieselPrice: number;
  cheapRemaining: number;
  thermalMass: number;
  tariff: Tariff;
};

export type NumericSetting = Exclude<keyof Settings, "tariff">;
export type SettingRange = { min: number; max: number; step: number };

// These bounds are the single source of truth for the Gold Lab controls.
export const ranges = {
  area: { min: 50, max: 250, step: 10 },
  intensity: { min: 30, max: 150, step: 1 },
  outside: { min: -5, max: 15, step: 1 },
  target: { min: 18, max: 24, step: 1 },
  initial: { min: 10, max: 24, step: 1 },
  cop: { min: 1.5, max: 5.5, step: 0.05 },
  efficiency: { min: 50, max: 95, step: 1 },
  dieselPrice: { min: 1, max: 1000, step: 1 },
  cheapRemaining: { min: 0, max: 300, step: 1 },
  thermalMass: { min: 20, max: 150, step: 1 },
} as const satisfies Record<NumericSetting, SettingRange>;

export const defaults: Settings = {
  area: 100,
  intensity: 75,
  outside: 7,
  target: 21,
  initial: 15,
  cop: 4.05,
  efficiency: 80,
  dieselPrice: 125,
  cheapRemaining: 0,
  thermalMass: 50,
  tariff: "home",
};

export const tariffs: { id: Tariff; label: string; rate: number }[] = [
  { id: "home", label: "منزلي · شريحتان", rate: 14 },
  { id: "commercial", label: "تجاري", rate: 14 },
  { id: "industrial", label: "صناعي وحرفي", rate: 14 },
  { id: "continuous", label: "معفى من التقنين", rate: 17 },
  { id: "heavy", label: "صهر ودرفلة المعادن", rate: 18 },
];

export type PresetId = "home" | "cold" | "capacity";
export type Preset = { id: PresetId; settings: Settings };

export const presets: Preset[] = [
  {
    id: "home",
    settings: { ...defaults, cheapRemaining: 150 },
  },
  {
    id: "cold",
    settings: {
      ...defaults,
      initial: 21,
      outside: 0,
      cop: 3.2,
      tariff: "commercial",
      cheapRemaining: 0,
    },
  },
  {
    id: "capacity",
    settings: {
      ...defaults,
      area: 250,
      intensity: 75,
      outside: -5,
      target: 21,
      initial: 15,
      cop: 3,
      efficiency: 80,
      dieselPrice: 125,
      cheapRemaining: 0,
      thermalMass: 50,
      tariff: "commercial",
    },
  },
];

export const CAPACITY = 16;
export const DIESEL_KWH_PER_LITRE = 10.64;
export const HOURS = 720;

export type Sample = {
  hour: number;
  temperature: number;
  heat: number;
  power: number;
  heatKwh: number;
  electricity: number;
  litres: number;
  hpCost: number;
  dieselCost: number;
};

const numericSettingKeys = Object.keys(ranges) as NumericSetting[];
const sampleKeys: (keyof Sample)[] = [
  "hour",
  "temperature",
  "heat",
  "power",
  "heatKwh",
  "electricity",
  "litres",
  "hpCost",
  "dieselCost",
];

export function validateSettings(value: unknown): Settings {
  if (value === null || typeof value !== "object") {
    throw new TypeError("settings must be an object");
  }

  const candidate = value as Record<string, unknown>;
  for (const key of numericSettingKeys) {
    const number = candidate[key];
    if (typeof number !== "number" || !Number.isFinite(number)) {
      throw new TypeError(`settings.${key} must be a finite number`);
    }

    const { min, max } = ranges[key];
    if (number < min || number > max) {
      throw new RangeError(`settings.${key} must be between ${min} and ${max}`);
    }
  }

  if (!tariffs.some(({ id }) => id === candidate.tariff)) {
    throw new RangeError("settings.tariff is not supported");
  }

  return value as Settings;
}

function assertFinite(label: string, values: number[]) {
  if (!values.every(Number.isFinite)) {
    throw new RangeError(`${label} produced a non-finite value`);
  }
}

function electricityCostForValidatedSettings(kwh: number, settings: Settings) {
  const energy = Math.max(0, kwh);
  if (settings.tariff === "home") {
    const cheap = Math.min(
      energy,
      Math.max(0, Math.min(300, settings.cheapRemaining)),
    );
    return cheap * 6 + (energy - cheap) * 14;
  }

  const rate = tariffs.find(({ id }) => id === settings.tariff)?.rate ?? 14;
  return energy * rate;
}

export function electricityCost(kwh: number, settings: Settings) {
  if (!Number.isFinite(kwh)) {
    throw new TypeError("kwh must be a finite number");
  }
  return electricityCostForValidatedSettings(kwh, validateSettings(settings));
}

export function simulate(settingsValue: Settings): Sample[] {
  const settings = validateSettings(settingsValue);

  // Fixed design condition: indoor 21°C, outdoor -5°C. Intensity is at this delta.
  const ua = (settings.area * settings.intensity) / 1000 / 26;
  const mass = (settings.area * settings.thermalMass) / 1000;
  const efficiency = settings.efficiency / 100;
  const dt = 1 / 60;
  assertFinite("Simulation setup", [ua, mass, efficiency]);

  let temperature = settings.initial;
  let heatKwh = 0;
  let electricity = 0;
  let litres = 0;
  const samples: Sample[] = [];

  for (let minute = 0; minute <= HOURS * 60; minute++) {
    const loss = ua * (temperature - settings.outside);
    // Illustrative proportional heat demand, same delivery in both houses.
    // Not a measured compressor map; effective COP is an explicit user input.
    const heat = Math.max(
      0,
      Math.min(CAPACITY, loss + (mass * (settings.target - temperature)) / 3),
    );
    const power = heat / settings.cop;
    assertFinite(`Simulation minute ${minute}`, [
      temperature,
      loss,
      heat,
      power,
      heatKwh,
      electricity,
      litres,
    ]);

    if (minute % 60 === 0) {
      samples.push({
        hour: minute / 60,
        temperature,
        heat,
        power,
        heatKwh,
        electricity,
        litres,
        hpCost: electricityCostForValidatedSettings(electricity, settings),
        dieselCost: litres * settings.dieselPrice,
      });
    }

    if (minute === HOURS * 60) break;

    temperature += ((heat - loss) / mass) * dt;
    heatKwh += heat * dt;
    electricity += power * dt;
    litres += (heat * dt) / (DIESEL_KWH_PER_LITRE * efficiency);
  }

  return samples;
}

export function sampleAt(
  samples: Sample[],
  hourValue: number,
  settingsValue: Settings,
): Sample {
  const settings = validateSettings(settingsValue);
  if (!Number.isFinite(hourValue)) {
    throw new TypeError("hour must be a finite number");
  }

  const hour = Math.max(0, Math.min(HOURS, hourValue));
  const a = samples[Math.floor(hour)];
  const b = samples[Math.ceil(hour)];
  if (!a || !b) {
    throw new RangeError("samples do not cover the requested hour");
  }
  assertFinite("Sample interpolation", [
    ...sampleKeys.map((key) => a[key]),
    ...sampleKeys.map((key) => b[key]),
  ]);

  const fraction = hour - Math.floor(hour);
  const interpolate = (key: keyof Sample) =>
    a[key] + (b[key] - a[key]) * fraction;
  const result = Object.fromEntries(
    sampleKeys.map((key) => [key, interpolate(key)]),
  ) as Sample;

  // Recompute nonlinear tariff cost after interpolating energy. This avoids
  // drawing a straight cost line across the household tariff breakpoint.
  result.hpCost = electricityCostForValidatedSettings(
    result.electricity,
    settings,
  );
  result.dieselCost = result.litres * settings.dieselPrice;
  assertFinite(
    "Interpolated sample",
    sampleKeys.map((key) => result[key]),
  );
  return result;
}

export const fmt = (number: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(number);

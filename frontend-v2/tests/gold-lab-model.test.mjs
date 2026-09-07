import test from "node:test";
import assert from "node:assert/strict";

import {
  defaults,
  electricityCost,
  HOURS,
  presets,
  ranges,
  sampleAt,
  simulate,
  validateSettings,
} from "../app/features/gold-lab/energy-model.ts";

const preset = (id) => {
  const match = presets.find((item) => item.id === id);
  assert.ok(match, `missing ${id} preset`);
  return match.settings;
};

const endOf = (settings) => simulate(settings).at(-1);

function closeTo(actual, expected, tolerance = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test("exports UI-aligned ranges and three valid presets", () => {
  assert.deepEqual(ranges.area, { min: 50, max: 250, step: 10 });
  assert.deepEqual(ranges.outside, { min: -5, max: 15, step: 1 });
  assert.deepEqual(ranges.cop, { min: 1.5, max: 5.5, step: 0.05 });
  assert.deepEqual(ranges.cheapRemaining, { min: 0, max: 300, step: 1 });
  assert.deepEqual(
    presets.map(({ id }) => id),
    ["home", "cold", "capacity"],
  );
  for (const item of presets)
    assert.equal(validateSettings(item.settings), item.settings);
});

test("home preset matches the independently derived 30-day solution", () => {
  const settings = preset("home");
  const samples = simulate(settings);
  const first = samples[0];
  const last = samples.at(-1);

  assert.equal(samples.length, HOURS + 1);
  closeTo(first.temperature, 15);
  closeTo(first.heat, 12.3076923076923);
  closeTo(first.power, 3.03893637226971);
  closeTo(last.temperature, 21, 1e-9);
  closeTo(last.heat, 4.03846153846154);
  closeTo(last.power, 0.997150997150997);
  closeTo(last.heatKwh, 2932.5, 1e-6);
  closeTo(last.electricity, 724.074074074074, 1e-6);
  closeTo(last.litres, 344.513627819549, 1e-6);
  closeTo(last.hpCost, 8937.03703703704, 1e-6);
  closeTo(last.dieselCost, 43064.2034774436, 1e-6);
  closeTo(
    ((last.dieselCost - last.hpCost) / last.dieselCost) * 100,
    79.2471790597076,
    1e-6,
  );
});

test("cold commercial preset is a steady heat-balance solution", () => {
  const settings = preset("cold");
  const samples = simulate(settings);
  const first = samples[0];
  const last = samples.at(-1);

  closeTo(first.temperature, 21);
  closeTo(first.heat, 6.05769230769231);
  closeTo(first.power, 1.89302884615385);
  closeTo(last.temperature, 21);
  closeTo(last.heat, first.heat);
  closeTo(last.power, first.power);
  closeTo(last.heatKwh, 4361.53846153846, 1e-6);
  closeTo(last.electricity, 1362.98076923077, 1e-6);
  closeTo(last.litres, 512.398785425212, 1e-6);
  closeTo(last.hpCost, 19081.7307692308, 1e-6);
  closeTo(last.dieselCost, 64049.8481781515, 1e-6);
  closeTo(
    ((last.dieselCost - last.hpCost) / last.dieselCost) * 100,
    70.208,
    1e-9,
  );
});

test("capacity preset remains capped and settles below the requested temperature", () => {
  const settings = preset("capacity");
  const samples = simulate(settings);
  const first = samples[0];
  const last = samples.at(-1);

  closeTo(first.temperature, 15);
  closeTo(first.heat, 16);
  closeTo(first.power, 5.33333333333333);
  closeTo(last.temperature, 17.1866666666667, 1e-9);
  closeTo(last.heat, 16);
  closeTo(last.power, first.power);
  closeTo(last.heatKwh, 11520, 1e-6);
  closeTo(last.electricity, 3840, 1e-6);
  closeTo(last.litres, 1353.38345864662, 1e-6);
  closeTo(last.hpCost, 53760, 1e-6);
  closeTo(last.dieselCost, 169172.932330827, 1e-6);
  closeTo(
    ((last.dieselCost - last.hpCost) / last.dieselCost) * 100,
    68.2218666666667,
    1e-9,
  );
  assert.ok(last.temperature < settings.target);
});

test("household and flat tariffs are exact at their boundaries", () => {
  const household = preset("home");
  closeTo(electricityCost(0, household), 0);
  closeTo(electricityCost(149, household), 894);
  closeTo(electricityCost(150, household), 900);
  closeTo(electricityCost(151, household), 914);
  closeTo(electricityCost(301, { ...household, cheapRemaining: 300 }), 1814);
  closeTo(electricityCost(100, { ...household, cheapRemaining: 0 }), 1400);
  closeTo(electricityCost(100, { ...household, tariff: "commercial" }), 1400);
  closeTo(electricityCost(100, { ...household, tariff: "industrial" }), 1400);
  closeTo(electricityCost(100, { ...household, tariff: "continuous" }), 1700);
  closeTo(electricityCost(100, { ...household, tariff: "heavy" }), 1800);
});

test("all valid preset samples remain finite and preserve common delivered heat", () => {
  for (const { settings } of presets) {
    for (const sample of simulate(settings)) {
      assert.ok(Object.values(sample).every(Number.isFinite));
      closeTo(sample.electricity, sample.heatKwh / settings.cop, 1e-8);
      closeTo(
        sample.litres,
        sample.heatKwh / (10.64 * (settings.efficiency / 100)),
        1e-8,
      );
    }
  }
});

test("invalid or non-finite settings cannot enter the simulation", () => {
  const invalidSettings = [
    { ...defaults, cop: 0 },
    { ...defaults, cop: Number.NaN },
    { ...defaults, efficiency: Number.POSITIVE_INFINITY },
    { ...defaults, thermalMass: 0 },
    { ...defaults, area: 251 },
    { ...defaults, tariff: "unknown" },
  ];

  for (const settings of invalidSettings) {
    assert.throws(() => simulate(settings));
  }
  assert.throws(() => electricityCost(Number.NaN, defaults), /finite/);
});

test("the model preserves a negative saving instead of hiding it", () => {
  const unfavorable = {
    ...defaults,
    cop: 1.5,
    dieselPrice: 1,
    tariff: "commercial",
  };
  const last = endOf(unfavorable);
  const saving = last.dieselCost - last.hpCost;
  const savingPercent = (saving / last.dieselCost) * 100;

  assert.ok(saving < 0);
  assert.ok(savingPercent < 0);
  assert.ok(last.hpCost > last.dieselCost);
});

test("sampleAt recomputes household cost at a tariff crossing", () => {
  const settings = preset("home");
  const samples = simulate(settings);
  const upper = samples.findIndex((sample) => sample.electricity > 150);
  assert.ok(upper > 0);

  const a = samples[upper - 1];
  const b = samples[upper];
  const fraction = (150 - a.electricity) / (b.electricity - a.electricity);
  const hour = upper - 1 + fraction;
  const interpolated = sampleAt(samples, hour, settings);
  const naiveCost = a.hpCost + (b.hpCost - a.hpCost) * fraction;

  closeTo(interpolated.electricity, 150, 1e-9);
  closeTo(interpolated.hpCost, 900, 1e-9);
  assert.ok(naiveCost > interpolated.hpCost);
  assert.throws(() => sampleAt(samples, hour), /settings/);
});

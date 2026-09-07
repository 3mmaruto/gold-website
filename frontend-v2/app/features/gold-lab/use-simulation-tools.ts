"use client";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import {
  simulate,
  sampleAt,
  tariffs,
  ranges,
  type Settings,
} from "./energy-model";
type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
};
type Context = {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useSimulationTools(
  settings: Settings,
  hour: number,
  apply: (s: Settings) => void,
  locale: string,
) {
  const state = useRef({ settings, hour, apply });
  state.current = { settings, hour, apply };
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const read = () => {
      const { settings: s, hour: h } = state.current,
        samples = simulate(s);
      return {
        settings: s,
        current: sampleAt(samples, h, s),
        day30: samples[720],
        currency: "new SYP",
      };
    };
    const register = (tool: Tool) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* Unsupported contexts do not affect the calculator. */
      }
    };
    register({
      name: "read_heating_comparison",
      title:
        locale === "ar" ? "قراءة مقارنة التدفئة" : "Read heating comparison",
      description:
        "Read the visible scenario assumptions, current totals and 30-day projection.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => read(),
    });
    register({
      name: "configure_heating_comparison",
      title:
        locale === "ar"
          ? "تعديل سيناريو التدفئة"
          : "Configure heating scenario",
      description:
        "Set one or more displayed scenario inputs and reset the simulation clock to zero. Returns the recalculated 30-day comparison.",
      inputSchema: {
        type: "object",
        properties: Object.fromEntries([
          ...Object.entries(ranges).map(([k, { min, max }]) => [
            k,
            { type: "number", minimum: min, maximum: max },
          ]),
          ["tariff", { type: "string", enum: tariffs.map((t) => t.id) }],
        ]),
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input: unknown) => {
        if (!input || typeof input !== "object" || Array.isArray(input))
          throw new Error("Expected an object of scenario inputs.");
        for (const [key, value] of Object.entries(input)) {
          if (key === "tariff") {
            if (
              typeof value !== "string" ||
              !tariffs.some((t) => t.id === value)
            )
              throw new Error("Unknown tariff.");
          } else {
            const range = ranges[key as keyof typeof ranges];
            if (
              !range ||
              typeof value !== "number" ||
              !Number.isFinite(value) ||
              value < range.min ||
              value > range.max
            )
              throw new Error(`Invalid ${key}.`);
          }
        }
        const next = { ...state.current.settings, ...input } as Settings;
        flushSync(() => state.current.apply(next));
        return read();
      },
    });
    return () => lifecycle.abort();
  }, [locale]);
}

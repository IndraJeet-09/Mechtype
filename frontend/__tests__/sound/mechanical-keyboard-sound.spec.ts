import { MechanicalKeyboardSoundSchema } from "@monkeytype/schemas/configs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getDefaultConfig } from "../../src/ts/constants/default-config";
import { __testing } from "../../src/ts/config/testing";
import { configEvent } from "../../src/ts/events/config";
import {
  isActive,
  resolvePackId,
  tap,
} from "../../src/ts/sound/mechanical-keyboard-sound";
import {
  DEFAULT_PACK,
  PACKS,
  findPack,
} from "../../src/ts/sound/rustyvibes/catalog";

describe("mechanical keyboard sound", () => {
  beforeEach(() => {
    // the engine lazily fetches the selected pack; there is no server in tests
    vi.stubGlobal("fetch", () => {
      throw new Error("no network in tests");
    });
    __testing.replaceConfig({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("catalog", () => {
    it("matches the config schema options", () => {
      expect(MechanicalKeyboardSoundSchema.options).toEqual([
        "off",
        ...PACKS.map((pack) => pack.id),
      ]);
    });

    it("has a default pack that exists in the catalog", () => {
      expect(findPack(DEFAULT_PACK)).toBeDefined();
      expect(getDefaultConfig().mechanicalKeyboardSound).toBe(DEFAULT_PACK);
    });

    it("gives every pack a label, category and asset url", () => {
      for (const pack of PACKS) {
        expect(pack.name.length).toBeGreaterThan(0);
        expect(["linear", "tactile", "clicky"]).toContain(pack.category);
        expect(pack.url).toBe(`../sounds/rustyvibes/${pack.id}.rvw`);
        expect(pack.bytes).toBeGreaterThan(0);
      }
    });
  });

  describe("resolvePackId", () => {
    it("keeps known pack ids", () => {
      expect(resolvePackId("cherry-mx-brown-pbt")).toBe("cherry-mx-brown-pbt");
      expect(resolvePackId(DEFAULT_PACK)).toBe(DEFAULT_PACK);
    });

    it("falls back to the default pack for unknown ids", () => {
      expect(resolvePackId("does-not-exist")).toBe(DEFAULT_PACK);
      expect(resolvePackId("")).toBe(DEFAULT_PACK);
    });
  });

  describe("isActive", () => {
    it("stays off until the config is ready", () => {
      expect(isActive()).toBe(false);
    });

    it("is on with the default pack once the config loads", () => {
      configEvent.dispatch({ key: "fullConfigChangeFinished" });
      expect(isActive()).toBe(true);
    });

    it("is off when configured off", () => {
      __testing.replaceConfig({ mechanicalKeyboardSound: "off" });
      configEvent.dispatch({ key: "fullConfigChangeFinished" });
      expect(isActive()).toBe(false);
    });

    it("reacts to the pack changing", () => {
      configEvent.dispatch({ key: "fullConfigChangeFinished" });
      expect(isActive()).toBe(true);

      __testing.replaceConfig({ mechanicalKeyboardSound: "off" });
      configEvent.dispatch({
        key: "mechanicalKeyboardSound",
        newValue: "off",
        previousValue: "holy-panda",
      });
      expect(isActive()).toBe(false);
    });
  });

  describe("tap", () => {
    it("does nothing while inactive", () => {
      __testing.replaceConfig({ mechanicalKeyboardSound: "off" });
      configEvent.dispatch({ key: "fullConfigChangeFinished" });
      expect(() => tap()).not.toThrow();
      expect(() => tap("KeyA")).not.toThrow();
    });
  });
});

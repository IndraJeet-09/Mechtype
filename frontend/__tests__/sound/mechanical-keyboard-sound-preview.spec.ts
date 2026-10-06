import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __testing } from "../../src/ts/config/testing";
import { Config } from "../../src/ts/config/store";
import {
  PREVIEW_DURATION_MS,
  preview,
} from "../../src/ts/sound/mechanical-keyboard-sound";
import { DEFAULT_PACK } from "../../src/ts/sound/rustyvibes/catalog";

const engine = vi.hoisted(() => {
  const state = {
    packId: "holy-panda",
    volume: 1,
    press: vi.fn(),
    release: vi.fn(),
    unlock: vi.fn(),
    setPack: vi.fn(async (id: string): Promise<void> => {
      state.packId = id;
    }),
  };
  return state;
});

vi.mock("../../src/ts/sound/rustyvibes/engine", () => ({
  AudioEngine: class {
    volume = 1;
    get packId(): string {
      return engine.packId;
    }
    unlock = engine.unlock;
    setPack = engine.setPack;
    press = engine.press;
    release = engine.release;
  },
}));

describe("preview", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "Date",
      ],
    });
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    vi.clearAllMocks();
    engine.packId = DEFAULT_PACK;
    __testing.replaceConfig({});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("types for a few seconds and hands the engine back to the configured pack", async () => {
    const done = preview("alpaca");

    expect(engine.setPack).toHaveBeenNthCalledWith(1, "alpaca");

    await vi.advanceTimersByTimeAsync(PREVIEW_DURATION_MS);
    await done;

    expect(engine.unlock).toHaveBeenCalled();
    expect(engine.press.mock.calls.length).toBeGreaterThan(3);
    expect(engine.release.mock.calls.length).toBeGreaterThan(3);
    expect(engine.setPack).toHaveBeenLastCalledWith(DEFAULT_PACK);
    expect(engine.packId).toBe(DEFAULT_PACK);
    expect(Config.mechanicalKeyboardSound).toBe(DEFAULT_PACK);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not change the configured pack while previewing", async () => {
    __testing.replaceConfig({ mechanicalKeyboardSound: "topre" });

    const done = preview("cherry-mx-blue-abs");
    await vi.advanceTimersByTimeAsync(PREVIEW_DURATION_MS);
    await done;

    expect(Config.mechanicalKeyboardSound).toBe("topre");
    expect(engine.setPack).toHaveBeenLastCalledWith("topre");
  });

  it("ignores unknown pack ids", async () => {
    await preview("does-not-exist");

    expect(engine.unlock).not.toHaveBeenCalled();
    expect(engine.setPack).not.toHaveBeenCalled();
    expect(engine.press).not.toHaveBeenCalled();
  });

  it("stays silent while keyboard sound is off", async () => {
    __testing.replaceConfig({ mechanicalKeyboardSound: "off" });

    const done = preview("alpaca");
    await vi.advanceTimersByTimeAsync(PREVIEW_DURATION_MS);
    await done;

    expect(engine.setPack).not.toHaveBeenCalled();
    expect(engine.press).not.toHaveBeenCalled();
  });

  it("cancels the running preview when another starts", async () => {
    const first = preview("alpaca");
    await vi.advanceTimersByTimeAsync(300);
    expect(engine.press.mock.calls.length).toBeGreaterThan(0);

    let firstDone = false;
    void first.then(() => {
      firstDone = true;
    });

    engine.press.mockClear();
    engine.setPack.mockClear();
    const second = preview("topre");
    await vi.advanceTimersByTimeAsync(0);

    expect(firstDone).toBe(true);
    expect(engine.setPack).toHaveBeenNthCalledWith(1, "topre");

    await vi.advanceTimersByTimeAsync(PREVIEW_DURATION_MS);
    await second;

    // the cancelled preview never restored the pack behind the new one's back
    expect(engine.setPack.mock.calls).toEqual([["topre"], [DEFAULT_PACK]]);
    expect(engine.press.mock.calls.length).toBeGreaterThan(3);
    expect(vi.getTimerCount()).toBe(0);
  });
});

import { Config } from "../config/store";
import { configEvent } from "../events/config";
import { DEFAULT_PACK, findPack } from "./rustyvibes/catalog";
import { AudioEngine } from "./rustyvibes/engine";
import { CODE_TO_KVK } from "./rustyvibes/keys";
import { KeyRouter } from "./rustyvibes/key-router";

/**
 * Mechanical keyboard sound (rustyvibes web soundpacks).
 *
 * One keypress -> one sound: key events are turned into presses/releases here,
 * while the built-in click sound is suppressed for the same keypress (see
 * `sound-controller.playClick` and `test/test-ui.afterAnyTestInput`).
 *
 * The engine fetches + decodes the selected `.rvw` soundpack lazily, keeps the
 * decoded AudioBuffer cached, and plays through a single AudioContext.
 */

let engine: AudioEngine | null = null;
let configReady = false;

/** The configured pack, falling back to the default when the id is unknown. */
export function resolvePackId(id: string): string {
  return findPack(id) !== undefined ? id : DEFAULT_PACK;
}

/** Whether mechanical keyboard sound should play for keypresses right now. */
export function isActive(): boolean {
  return configReady && Config.mechanicalKeyboardSound !== "off";
}

function getEngine(): AudioEngine {
  if (engine === null) {
    engine = new AudioEngine();
    engine.volume = Config.soundVolume;
  }
  return engine;
}

function applyConfig(): void {
  configReady = true;
  const id = Config.mechanicalKeyboardSound;
  if (id === "off") return;
  const active = getEngine();
  active.volume = Config.soundVolume;
  void active.setPack(resolvePackId(id));
}

/** How long a pack preview keeps typing for. */
export const PREVIEW_DURATION_MS = 3000;

const PREVIEW_LETTERS = [
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyT",
  "KeyH",
  "KeyO",
  "KeyC",
  "KeyE",
  "KeyR",
  "KeyN",
  "KeyI",
  "KeyM",
  "KeyW",
  "KeyU",
] as const;
const PREVIEW_KEYS_PER_WORD = 5;
const PREVIEW_KEY_GAP: readonly [number, number] = [60, 145];
const PREVIEW_PAUSE_GAP: readonly [number, number] = [165, 270];
const PREVIEW_WORD_GAP: readonly [number, number] = [200, 340];

const TAP_KEYS = [
  "Space",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyT",
  "KeyH",
  "KeyO",
  "KeyC",
] as const;

let previewToken = 0;
let previewTimer: ReturnType<typeof setTimeout> | null = null;
let previewWake: (() => void) | null = null;

function cancelPendingSleep(): void {
  if (previewTimer !== null) {
    clearTimeout(previewTimer);
    previewTimer = null;
  }
  const wake = previewWake;
  previewWake = null;
  wake?.();
}

async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    const finish = (): void => {
      if (previewTimer !== null) {
        clearTimeout(previewTimer);
        previewTimer = null;
      }
      previewWake = null;
      resolve();
    };
    previewWake = finish;
    previewTimer = setTimeout(finish, ms);
  });
}

function randomBetween([min, max]: readonly [number, number]): number {
  return Math.round(min + Math.random() * (max - min));
}

function nextLetter(): string {
  const index = Math.floor(Math.random() * PREVIEW_LETTERS.length);
  return PREVIEW_LETTERS[index] as string;
}

/** A natural typing rhythm: keystrokes, the odd pause, longer gaps on spaces. */
function nextGap(afterSpace: boolean): number {
  if (afterSpace) return randomBetween(PREVIEW_WORD_GAP);
  return Math.random() < 0.15
    ? randomBetween(PREVIEW_PAUSE_GAP)
    : randomBetween(PREVIEW_KEY_GAP);
}

/** Plays a short typing sample of a pack - does not change the configured pack. */
export async function preview(id: string): Promise<void> {
  if (findPack(id) === undefined) return;
  // while sound is off only picking a card (which turns sound back on) previews
  if (Config.mechanicalKeyboardSound === "off") return;

  const token = ++previewToken;
  cancelPendingSleep();

  const active = getEngine();
  active.unlock();
  if (active.packId !== id) await active.setPack(id);
  if (token !== previewToken) return;

  const startedAt = Date.now();
  let sinceSpace = 0;
  let heldKvk: number | undefined;

  while (Date.now() - startedAt < PREVIEW_DURATION_MS) {
    if (token !== previewToken) return;
    if (heldKvk !== undefined) active.release(heldKvk);

    const key = sinceSpace >= PREVIEW_KEYS_PER_WORD ? "Space" : nextLetter();
    const kvk = CODE_TO_KVK[key];
    if (kvk === undefined) break;
    active.press(kvk);
    heldKvk = kvk;
    sinceSpace = key === "Space" ? 0 : sinceSpace + 1;

    const remaining = PREVIEW_DURATION_MS - (Date.now() - startedAt);
    if (remaining <= 0) break;
    await sleep(Math.min(nextGap(key === "Space"), remaining));
  }

  if (token !== previewToken) return;
  if (heldKvk !== undefined) active.release(heldKvk);

  // the preview borrows the engine, so hand it back to the configured pack
  const configured: string = Config.mechanicalKeyboardSound;
  const wanted = configured === "off" ? undefined : resolvePackId(configured);
  if (wanted !== undefined && active.packId !== wanted) {
    await active.setPack(wanted);
  }
}

/**
 * A single press of the configured pack, for previews that are not real
 * keypresses (volume slider, command line, replay).
 */
export function tap(code?: string): void {
  if (!isActive()) return;
  const active = getEngine();
  active.unlock();
  const chosen =
    code ??
    TAP_KEYS[Math.floor(Math.random() * TAP_KEYS.length)] ??
    TAP_KEYS[0] ??
    "Space";
  active.press(CODE_TO_KVK[chosen]);
}

const router = new KeyRouter({
  press: (_code, kvk) => {
    const active = getEngine();
    active.unlock();
    active.press(kvk);
  },
  release: (_code, kvk) => {
    if (isActive()) engine?.release(kvk);
  },
});

// sound is a side effect of the physical key, not of the typed character, so it
// listens at the document level: shift, caps lock, enter... all play.
document.addEventListener("keydown", (event) => {
  if (event.isComposing || CODE_TO_KVK[event.code] === undefined) return;
  if (!isActive()) return;
  router.down(event, null);
});

document.addEventListener("keyup", (event) => {
  if (CODE_TO_KVK[event.code] === undefined) return;
  router.up(event);
});

function releaseAll(): void {
  router.releaseAll();
}

window.addEventListener("blur", releaseAll);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") releaseAll();
});

// browsers keep the AudioContext suspended until a user gesture; unlock on the
// first interaction so the first keypress is not silent.
const unlockAudio = (): void => {
  if (isActive()) getEngine().unlock();
};
document.addEventListener("pointerdown", unlockAudio, {
  capture: true,
  passive: true,
});
// capture-phase keydown ensures the context is running before any typing handler
document.addEventListener("keydown", unlockAudio, { capture: true });

configEvent.subscribe((event) => {
  switch (event.key) {
    case "mechanicalKeyboardSound":
    case "fullConfigChangeFinished":
      applyConfig();
      break;
    case "soundVolume":
      if (engine !== null) engine.volume = event.newValue;
      break;
  }
});

export const __testing = {
  getEngine: (): AudioEngine | null => engine,
};

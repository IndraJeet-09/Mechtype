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
 * while Monkeytype's own click sound is suppressed for the same keypress (see
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

/** Plays a short sample of a pack - does not change the configured pack. */
export async function preview(id: string): Promise<void> {
  if (findPack(id) === undefined) return;
  const token = ++previewToken;
  const active = getEngine();
  active.unlock();
  if (active.packId !== id) await active.setPack(id);
  if (token !== previewToken) return;
  for (const code of PREVIEW_SEQUENCE) {
    if (token !== previewToken) return;
    active.press(CODE_TO_KVK[code]);
    await sleep(PREVIEW_GAP_MS);
  }
  const configured = Config.mechanicalKeyboardSound;
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

const PREVIEW_SEQUENCE = [
  "Space",
  "KeyT",
  "KeyH",
  "KeyO",
  "KeyC",
  "KeyK",
] as const;
const PREVIEW_GAP_MS = 90;
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

async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
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
document.addEventListener(
  "pointerdown",
  () => {
    if (isActive()) getEngine().unlock();
  },
  { capture: true },
);

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

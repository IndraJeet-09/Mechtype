import { CODE_TO_KVK } from "./keys";

/** How long a Caps Lock press shows: macOS reports its keyup only when the lock turns off. */
const LOCK_TAP_MS = 110;
/** A Caps Lock keyup this soon after its keydown belongs to the same press. */
const LOCK_SAME_PRESS_MS = 400;

export type KeyLike = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
};

export type KeyEventLike = {
  code: string;
  repeat: boolean;
  isComposing: boolean;
} & KeyLike;

/** Tracks held keys; macOS browsers drop keyups for keys pressed while ⌘ is held. */
export class HeldKeys {
  #down = new Set<string>();

  down(code: string): boolean {
    if (this.#down.has(code)) return false;
    this.#down.add(code);
    return true;
  }

  up(code: string): boolean {
    return this.#down.delete(code);
  }

  releaseAll(): string[] {
    const all = [...this.#down];
    this.#down.clear();
    return all;
  }
}

export type TypingHandlers = {
  /** A key went down (auto-repeat excluded, as in the app): sound and keycap. */
  press(
    code: string,
    kvk: number | undefined,
    mods: { meta: boolean; ctrl: boolean },
  ): void;
  release(code: string, kvk: number | undefined): void;
  /** Text for the typing line from every keydown, auto-repeat included, so held keys repeat. */
  text?(key: string, mods: { meta: boolean; ctrl: boolean }): void;
};

/**
 * Turns key events into presses and releases: auto-repeat only repeats text, keys whose
 * keyups ⌘ swallowed are released, and Caps Lock plays as a tap (macOS sends its keydown
 * when the lock turns on and its keyup only when it turns off).
 */
export class KeyRouter {
  #held = new HeldKeys();
  #capsDownAt = Number.NEGATIVE_INFINITY;
  private readonly handlers: TypingHandlers;
  private readonly schedule: (fn: () => void, ms: number) => void;
  private readonly now: () => number;

  constructor(
    handlers: TypingHandlers,
    schedule: (fn: () => void, ms: number) => void = (
      fn: () => void,
      ms: number,
    ) => void setTimeout(fn, ms),
    now: () => number = () => performance.now(),
  ) {
    this.handlers = handlers;
    this.schedule = schedule;
    this.now = now;
  }

  down(e: KeyEventLike, text: string | null): void {
    if (e.isComposing) return;
    const mods = { meta: e.metaKey, ctrl: e.ctrlKey };
    if (!e.repeat && this.#held.down(e.code)) {
      this.handlers.press(e.code, CODE_TO_KVK[e.code], mods);
      if (e.code === "CapsLock") {
        this.#capsDownAt = this.now();
        this.schedule(() => this.#lift("CapsLock"), LOCK_TAP_MS);
      }
    }
    if (text !== null) this.handlers.text?.(text, mods);
  }

  up(e: KeyEventLike): void {
    if (e.code === "MetaLeft" || e.code === "MetaRight") {
      this.releaseAll();
      return;
    }
    if (e.code === "CapsLock") {
      if (this.now() - this.#capsDownAt < LOCK_SAME_PRESS_MS) return;
      // The press that turns the lock off arrives as a lone keyup: play it as a tap.
      if (this.#held.down("CapsLock")) {
        this.handlers.press("CapsLock", CODE_TO_KVK["CapsLock"], {
          meta: false,
          ctrl: false,
        });
        this.schedule(() => this.#lift("CapsLock"), LOCK_TAP_MS);
      }
      return;
    }
    this.#lift(e.code);
  }

  releaseAll(): void {
    for (const code of this.#held.releaseAll()) {
      this.handlers.release(code, CODE_TO_KVK[code]);
    }
  }

  #lift(code: string): void {
    if (this.#held.up(code)) this.handlers.release(code, CODE_TO_KVK[code]);
  }
}

import type { MechanicalKeyboardSound as MechanicalKeyboardSoundId } from "@monkeytype/schemas/configs";

import {
  For,
  JSXElement,
  Show,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

import { setConfig } from "../../../config/setters";
import { getConfig } from "../../../config/store";
import { preview } from "../../../sound/mechanical-keyboard-sound";
import {
  CATEGORIES,
  PACKS,
  packLabel,
  type PackInfo,
  type SoundpackCategory,
} from "../../../sound/rustyvibes/catalog";
import { prefetchPack } from "../../../sound/rustyvibes/packs";
import { getFocus } from "../../../states/test";
import { cn } from "../../../utils/cn";
import { prefersReducedMotion } from "../../../utils/misc";
import { Fa } from "../../common/Fa";

type Filter = "all" | SoundpackCategory;

const FILTERS: readonly Filter[] = ["all", ...CATEGORIES];

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** The top face of the keycap: the pack colour lightened towards white. */
function keycapFace(color: string): string {
  return `color-mix(in srgb, ${color} 76%, #ffffff)`;
}

/**
 * "Pick your switch." - the soundtrack selector directly under the typing
 * area. One click selects the pack (persisted through the regular config) and
 * plays a ~3s typing preview; the play button only previews.
 */
export function KeyboardSoundSelector(): JSXElement {
  const [filter, setFilter] = createSignal<Filter>("all");

  const visiblePacks = (): readonly PackInfo[] =>
    filter() === "all"
      ? PACKS
      : PACKS.filter((pack) => pack.category === filter());

  const selectedId = (): string => getConfig.mechanicalKeyboardSound;
  const isOff = (): boolean => selectedId() === "off";
  // "Off" and the category pills share one segmented control, so only one shows pressed
  const isPressed = (value: Filter): boolean => filter() === value && !isOff();

  const select = (pack: PackInfo): void => {
    setConfig("mechanicalKeyboardSound", pack.id as MechanicalKeyboardSoundId);
    void preview(pack.id);
  };

  const turnOff = (): void => {
    setConfig("mechanicalKeyboardSound", "off");
  };

  // clicking a card must not steal focus from the words mid-test
  const keepTyping = (event: MouseEvent): void => event.preventDefault();

  // scroll reveal: skipped when motion is reduced or IO is unavailable
  const [revealed, setRevealed] = createSignal(
    prefersReducedMotion() || typeof IntersectionObserver === "undefined",
  );
  let sectionElement: HTMLElement | undefined;

  onMount(() => {
    if (revealed()) return;
    const target = sectionElement;
    if (target === undefined) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );
    observer.observe(target);
    onCleanup(() => observer.disconnect());
  });

  const revealClass = (): string => (revealed() ? "mt-reveal" : "opacity-0");
  const revealDelay = (index: number): string =>
    `${180 + Math.min(index, 10) * 30}ms`;

  return (
    <section
      ref={(el) => (sectionElement = el)}
      aria-label="Mechanical keyboard sounds"
      aria-labelledby="keyboardSoundTitle"
      data-ui-element="keyboardSoundSelector"
      class={cn(
        "relative w-full overflow-hidden border-t border-text/10 bg-sub-alt/40 transition-opacity duration-125",
        getFocus() && "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--main-color), transparent 70%)",
        }}
      ></div>
      <div class="relative mx-auto w-full max-w-[100rem] px-8 pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20">
        <h2
          id="keyboardSoundTitle"
          class={cn(
            "font-display text-[2.5rem] leading-[1.05] font-bold tracking-tight text-text md:text-[3.5rem] lg:text-[4.5rem]",
            revealClass(),
          )}
          style={{ "animation-delay": "0ms" }}
        >
          Pick your switch.
        </h2>
        <p
          class={cn(
            "mt-5 max-w-[47.5rem] text-base leading-relaxed text-sub md:text-lg lg:text-xl",
            revealClass(),
          )}
          style={{ "animation-delay": "80ms" }}
        >
          Twenty-one real mechanical keyboard sound profiles, from the crisp
          click of Cherry MX Blue to the deep thock of Topre. Pick a sound and
          make every keystroke feel different.
        </p>

        <div
          class={cn("mt-12 flex justify-start", revealClass())}
          style={{ "animation-delay": "160ms" }}
        >
          <div
            role="group"
            aria-label="Filter switches"
            class="flex w-max items-center gap-1 rounded-full bg-sub-alt p-1"
          >
            <For each={FILTERS}>
              {(value) => (
                <button
                  type="button"
                  data-pack-filter={value}
                  aria-pressed={isPressed(value)}
                  onClick={() => setFilter(value)}
                  class={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
                    isPressed(value)
                      ? "bg-text font-semibold text-bg"
                      : "text-sub hover:text-text",
                  )}
                >
                  {capitalize(value)}
                </button>
              )}
            </For>
            <button
              type="button"
              data-pack-filter="off"
              aria-pressed={isOff()}
              onClick={turnOff}
              class={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
                isOff()
                  ? "bg-text font-semibold text-bg"
                  : "text-sub hover:text-text",
              )}
            >
              Off
            </button>
          </div>
        </div>

        <ul class="mt-10 grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <For each={visiblePacks()}>
            {(pack, index) => {
              const isSelected = (): boolean => selectedId() === pack.id;
              const label = (): string => packLabel(pack);

              return (
                <li
                  class={cn(
                    "group relative transition-transform duration-150 ease-out hover:-translate-y-0.5 motion-reduce:transition-none",
                    revealClass(),
                  )}
                  style={{ "animation-delay": revealDelay(index()) }}
                >
                  <button
                    type="button"
                    data-pack={pack.id}
                    data-category={pack.category}
                    aria-pressed={isSelected()}
                    onClick={() => select(pack)}
                    onMouseDown={keepTyping}
                    onPointerEnter={() => prefetchPack(pack.url)}
                    onFocus={() => prefetchPack(pack.url)}
                    class={cn(
                      "flex w-full cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 pr-14 text-left transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main motion-reduce:transition-none",
                      isSelected()
                        ? "border-main/70 bg-main/10"
                        : "border-text/10 bg-sub-alt hover:border-text/25 hover:bg-text/5 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.8)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      class="h-11 w-11 shrink-0 rounded-[10px] p-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.45)]"
                      style={{ "background-color": pack.color }}
                    >
                      <span
                        class="block h-full w-full rounded-[7px]"
                        style={{
                          "background-color": keycapFace(pack.color),
                          "box-shadow":
                            "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 4px rgba(0,0,0,0.35)",
                        }}
                      ></span>
                    </span>

                    <span class="min-w-0 flex-1">
                      <span class="flex min-w-0 items-center gap-2">
                        <span class="truncate text-[0.95rem] font-semibold text-text">
                          {pack.name}
                        </span>
                        <Show when={pack.variant !== undefined}>
                          <span class="shrink-0 rounded-[4px] bg-text/10 px-1.5 py-0.5 text-[0.6rem] leading-none font-medium tracking-wide text-sub uppercase">
                            {pack.variant}
                          </span>
                        </Show>
                      </span>
                      <span class="mt-1 block truncate text-[0.8rem] text-sub">
                        {capitalize(pack.category)} · {pack.description}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label={`Preview ${label()}`}
                    data-preview={pack.id}
                    onMouseDown={keepTyping}
                    onClick={() => {
                      void preview(pack.id);
                    }}
                    class={cn(
                      "absolute top-1/2 right-3.5 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main motion-reduce:transition-none",
                      isSelected()
                        ? "bg-main text-text group-hover:scale-110"
                        : "bg-text/10 text-text group-hover:scale-110 group-hover:bg-text/20",
                    )}
                  >
                    <Fa icon="fa-play" class="text-[0.7rem]" />
                  </button>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </section>
  );
}

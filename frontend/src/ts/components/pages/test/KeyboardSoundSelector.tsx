import type { MechanicalKeyboardSound as MechanicalKeyboardSoundId } from "@monkeytype/schemas/configs";
import { For, JSXElement, Show, createSignal } from "solid-js";

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
import { Fa } from "../../common/Fa";

type Filter = "all" | SoundpackCategory;

const FILTERS: readonly Filter[] = ["all", ...CATEGORIES];

/**
 * "Choose the keyboard you're typing on" - the soundpack gallery below the
 * typing area. Reads and writes the one `mechanicalKeyboardSound` config, so
 * the command line and this selector always agree.
 */
export function KeyboardSoundSelector(): JSXElement {
  const [filter, setFilter] = createSignal<Filter>("all");

  const visiblePacks = (): readonly PackInfo[] =>
    filter() === "all"
      ? PACKS
      : PACKS.filter((pack) => pack.category === filter());

  const selectedId = (): string => getConfig.mechanicalKeyboardSound;
  const isOff = (): boolean => selectedId() === "off";

  const select = (pack: PackInfo): void => {
    setConfig("mechanicalKeyboardSound", pack.id as MechanicalKeyboardSoundId);
  };

  const turnOff = (): void => {
    setConfig("mechanicalKeyboardSound", "off");
  };

  // clicking a card must not steal focus from the words mid-test
  const keepTyping = (event: MouseEvent): void => event.preventDefault();

  return (
    <section
      aria-label="Keyboard sounds"
      data-ui-element="keyboardSoundSelector"
      class={cn(
        "mx-auto flex w-full max-w-[56rem] scroll-mt-8 flex-col gap-3 px-1 pb-8 pt-6 transition-opacity duration-125",
        getFocus() && "pointer-events-none opacity-0",
      )}
    >
      <div class="flex items-baseline justify-between gap-2">
        <h2 class="text-sm text-sub">keyboard sounds</h2>
        <p class="min-w-0 truncate text-xs text-sub">
          typing on{" "}
          <span class={cn(!isOff() && "text-main")}>
            {isOff() ? "off" : packLabel(selectedId())}
          </span>
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-1.5">
        <For each={FILTERS}>
          {(value) => (
            <button
              type="button"
              data-pack-filter={value}
              aria-pressed={filter() === value}
              onClick={() => setFilter(value)}
              class={cn(
                "cursor-pointer rounded-full px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-main",
                filter() === value
                  ? "bg-main text-bg"
                  : "bg-sub-alt text-sub hover:text-text",
              )}
            >
              {value}
            </button>
          )}
        </For>
        <button
          type="button"
          aria-pressed={isOff()}
          onClick={turnOff}
          class={cn(
            "ml-2 cursor-pointer rounded-full px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-main",
            isOff()
              ? "bg-main text-bg"
              : "bg-sub-alt text-sub hover:text-text",
          )}
        >
          off
        </button>
      </div>

      <ul class="flex w-full snap-x gap-2 overflow-x-auto pb-1">
        <For each={visiblePacks()}>
          {(pack) => {
            const isSelected = (): boolean => selectedId() === pack.id;
            const label = (): string => packLabel(pack);

            return (
              <li
                class={cn(
                  "relative w-52 shrink-0 snap-start rounded-(--roundness) bg-sub-alt transition-colors",
                  isSelected() && "ring-1 ring-main",
                )}
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
                    "flex w-full cursor-pointer items-center gap-2 rounded-(--roundness) py-2 pl-3 pr-10 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main",
                    isSelected() && "text-main",
                  )}
                >
                  <span
                    class="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-bg"
                    style={{ "background-color": pack.color }}
                  ></span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm leading-tight">
                      {pack.name}
                      <Show when={pack.variant !== undefined}>
                        <span class="ml-1 text-xs text-sub">{pack.variant}</span>
                      </Show>
                    </span>
                    <span class="block truncate text-xs capitalize leading-tight text-sub">
                      {pack.category}
                    </span>
                  </span>
                  <Show when={isSelected()}>
                    <Fa icon="fa-check" class="shrink-0" />
                  </Show>
                </button>
                <button
                  type="button"
                  aria-label={`Preview ${label()}`}
                  onMouseDown={keepTyping}
                  onClick={() => {
                    void preview(pack.id);
                  }}
                  class="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-bg text-xs text-sub transition-colors hover:text-main focus-visible:outline-2 focus-visible:outline-main"
                >
                  <Fa icon="fa-play" />
                </button>
              </li>
            );
          }}
        </For>
      </ul>

      <p class="text-center text-xs text-sub">
        {visiblePacks().length} soundpacks
      </p>
    </section>
  );
}

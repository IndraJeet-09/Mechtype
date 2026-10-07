import { JSXElement } from "solid-js";

import { restartTestEvent } from "../../../events/test";
import { getActivePage } from "../../../states/core";
import { getFocus } from "../../../states/test";
import { cn } from "../../../utils/cn";

export function Logo(): JSXElement {
  return (
    <a
      href={`${location.origin}/`}
      class="mx-auto flex w-max items-center gap-2.5 rounded-[0.8rem] px-2 py-1.5 transition-opacity hover:opacity-90"
      aria-label="MechType home"
      router-link
      data-ui-element="branding"
      onClick={() => {
        if (getActivePage() === "test") restartTestEvent.dispatch();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        class={cn(
          "h-7 w-7 shrink-0 text-main transition-colors",
          getFocus() && "text-sub",
        )}
      >
        <rect
          x="2.6"
          y="2.6"
          width="18.8"
          height="18.8"
          rx="5"
          fill="none"
          stroke="currentColor"
          class="[stroke-width:2.6]"
        ></rect>
        <rect
          x="8"
          y="8"
          width="8"
          height="8"
          rx="2"
          fill="currentColor"
        ></rect>
      </svg>
      <h1
        class={cn(
          "font-display text-[1.5rem] leading-none font-extrabold tracking-tight text-text transition-colors duration-250 sm:text-[1.875rem]",
          getFocus() && "text-sub",
        )}
        data-ui-element="brandingText"
      >
        MechType
      </h1>
    </a>
  );
}

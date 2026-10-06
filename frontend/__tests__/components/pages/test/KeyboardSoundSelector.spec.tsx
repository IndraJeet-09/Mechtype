import { fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// layout data is fetched while states/test is imported; keep it offline
vi.hoisted(() => {
  const response = {
    ok: true,
    status: 200,
    statusText: "OK",
    headers: {
      get: (name: string): string | null =>
        name === "content-type" ? "application/json" : null,
    },
    json: async (): Promise<unknown> => ({}),
    text: async (): Promise<string> => "",
    arrayBuffer: async (): Promise<ArrayBuffer> => new ArrayBuffer(0),
  };
  const stub = (async (): Promise<typeof response> =>
    response) as unknown as typeof fetch;
  globalThis.fetch = stub;
  if (typeof window !== "undefined") window.fetch = stub;
});

import { setConfig } from "../../../../src/ts/config/setters";
import { Config } from "../../../../src/ts/config/store";
import { PACKS } from "../../../../src/ts/sound/rustyvibes/catalog";

const preview = vi.hoisted(() => vi.fn(async (): Promise<void> => undefined));

vi.mock("../../../../src/ts/sound/mechanical-keyboard-sound", () => ({
  preview,
}));

import { KeyboardSoundSelector } from "../../../../src/ts/components/pages/test/KeyboardSoundSelector";

function renderSelector(): ReturnType<typeof render> {
  return render(() => <KeyboardSoundSelector />);
}

function find(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector);
  if (element === null) throw new Error(`missing element: ${selector}`);
  return element;
}

function packButtons(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-pack]"));
}

describe("KeyboardSoundSelector", () => {
  beforeEach(() => {
    preview.mockClear();
    setConfig("mechanicalKeyboardSound", "holy-panda");
  });

  afterEach(() => {
    setConfig("mechanicalKeyboardSound", "holy-panda");
  });

  it("shows the heading, description and every pack", () => {
    const { container } = renderSelector();

    expect(
      screen.getByRole("heading", { name: "Pick your switch." }),
    ).toBeInTheDocument();
    expect(container.textContent).toContain(
      "Twenty-one real mechanical keyboard sound profiles",
    );
    expect(packButtons(container)).toHaveLength(PACKS.length);
    expect(
      container.querySelector('[data-ui-element="keyboardSoundSelector"]'),
    ).toBeTruthy();
  });

  it("marks the configured pack as selected", () => {
    setConfig("mechanicalKeyboardSound", "topre");
    const { container } = renderSelector();

    const selected = container.querySelector<HTMLElement>(
      '[data-pack="topre"]',
    );
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector('[data-pack="holy-panda"]')).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("filters packs by switch type", () => {
    const { container } = renderSelector();

    fireEvent.click(screen.getByRole("button", { name: "Clicky" }));

    const visible = packButtons(container);
    expect(visible.length).toBeLessThan(PACKS.length);
    expect(visible.length).toBe(
      PACKS.filter((pack) => pack.category === "clicky").length,
    );
    for (const button of visible) {
      expect(button.dataset["category"]).toBe("clicky");
    }

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(packButtons(container)).toHaveLength(PACKS.length);
  });

  it("selecting a pack stores it and previews it", () => {
    const { container } = renderSelector();

    fireEvent.click(find(container, '[data-pack="cherry-mx-blue-abs"]'));

    expect(Config.mechanicalKeyboardSound).toBe("cherry-mx-blue-abs");
    expect(preview).toHaveBeenCalledWith("cherry-mx-blue-abs");
    expect(
      container.querySelector('[data-pack="cherry-mx-blue-abs"]'),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("previews without changing the configured pack", () => {
    setConfig("mechanicalKeyboardSound", "holy-panda");
    const { container } = renderSelector();

    fireEvent.click(find(container, '[data-preview="topre"]'));

    expect(preview).toHaveBeenCalledWith("topre");
    expect(Config.mechanicalKeyboardSound).toBe("holy-panda");
  });

  it("labels every preview button", () => {
    const { container } = renderSelector();

    const buttons = Array.from(
      container.querySelectorAll<HTMLElement>("[data-preview]"),
    );
    expect(buttons).toHaveLength(PACKS.length);
    for (const button of buttons) {
      expect(button.getAttribute("aria-label")).toMatch(/^Preview .+/);
    }
  });

  it("turns sound off without previewing", () => {
    setConfig("mechanicalKeyboardSound", "holy-panda");
    const { container } = renderSelector();

    fireEvent.click(screen.getByRole("button", { name: "Off" }));

    expect(Config.mechanicalKeyboardSound).toBe("off");
    expect(preview).not.toHaveBeenCalled();
    expect(container.querySelector('[data-pack-filter="off"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector('[data-pack-filter="all"]')).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

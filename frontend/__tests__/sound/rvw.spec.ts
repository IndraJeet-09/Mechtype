import { describe, expect, it } from "vitest";

import {
  decodeRvw,
  encodeRvw,
  type RvwHeader,
} from "../../src/ts/sound/rustyvibes/rvw";

const HEADER: RvwHeader = {
  id: "test-pack",
  sampleRate: 44100,
  clips: [
    [0, 3],
    [3, 3],
  ],
  press: { "0": [0, 1], "36": [1, 1] },
  release: { "0": [1, 1], "36": [0, 1] },
};

describe("rvw", () => {
  it("round-trips header and pcm", () => {
    const pcm = new Int16Array([0, 1, -1, 32767, -32768, 1234]);
    const bytes = encodeRvw(HEADER, pcm);
    const { header, pcm: decoded } = decodeRvw(bytes.buffer);

    expect(header).toEqual(HEADER);
    expect(Array.from(decoded)).toEqual(Array.from(pcm));
  });

  it("pads odd-length headers so pcm still decodes", () => {
    const pcm = new Int16Array([1, 2, 3]);
    for (const id of ["test-pack", "test-pack-x"]) {
      const bytes = encodeRvw(
        { ...HEADER, clips: [], press: {}, release: {}, id },
        pcm,
      );
      const decoded = decodeRvw(bytes.buffer);
      expect(decoded.header.id).toBe(id);
      expect(Array.from(decoded.pcm)).toEqual(Array.from(pcm));
    }
  });

  it("rejects data that is not a web soundpack", () => {
    expect(() => decodeRvw(new ArrayBuffer(16))).toThrow("not a web soundpack");
  });

  it("rejects a truncated header", () => {
    const bytes = encodeRvw(HEADER, new Int16Array(4));
    const truncated = bytes.buffer.slice(0, 12);
    expect(() => decodeRvw(truncated)).toThrow("truncated web soundpack");
  });
});

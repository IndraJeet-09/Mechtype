import { decodeRvw, type RvwHeader } from "./rvw";

export type LoadedPack = {
  id: string;
  header: RvwHeader;
  buffer: AudioBuffer;
};

const cache = new Map<string, Promise<LoadedPack>>();

/**
 * Fetches and decodes a web pack into one AudioBuffer. Needs no AudioContext, so it can
 * run before the visitor's first gesture; failed loads can be retried.
 */
export async function loadPack(id: string, url: string): Promise<LoadedPack> {
  let pending = cache.get(id);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`couldn't load ${id} (${response.status})`);
      }
      const { header, pcm } = decodeRvw(await response.arrayBuffer());
      const samples = new Float32Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) samples[i] = (pcm[i] ?? 0) / 32768;
      const buffer = new AudioBuffer({
        numberOfChannels: 1,
        length: pcm.length,
        sampleRate: header.sampleRate,
      });
      buffer.copyToChannel(samples, 0);
      return { id, header, buffer };
    })();
    void pending.catch(() => cache.delete(id));
    cache.set(id, pending);
  }
  const pack = await pending;
  return pack;
}

/** Warms the HTTP cache for a pack the visitor is about to choose. */
export function prefetchPack(url: string): void {
  void fetch(url, { priority: "low" }).catch(() => undefined);
}

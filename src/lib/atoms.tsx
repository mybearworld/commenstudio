import { atomWithStorage } from "jotai/utils";

export const studiosAtom = atomWithStorage<number[]>(
  "commenstudio:studios",
  [],
);
export const studioColorsAtom = atomWithStorage<{
  [k: string]: { color: string };
}>("commenstudio:studioColors", {});
export const readToAtom = atomWithStorage("commenstudio:readTo", 0);

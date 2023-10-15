import { atomWithStorage } from "jotai/utils";

export const studiosAtom = atomWithStorage<number[]>(
  "commenstudio:studios",
  [],
);
export const readToAtom = atomWithStorage("commenstudio:readTo", 0);

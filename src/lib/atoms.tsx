import { atomWithStorage } from "jotai/utils";

export const studiosAtom = atomWithStorage<number[]>("studios", []);
export const readToAtom = atomWithStorage("readTo", 0);

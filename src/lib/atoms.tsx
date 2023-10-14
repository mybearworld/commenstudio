import { atomWithStorage } from "jotai/utils";

export const studiosAtom = atomWithStorage<number[]>("studios", []);

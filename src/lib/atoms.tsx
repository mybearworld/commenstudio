import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CommentRepresentation } from "./getComments";

export const notificationsAtom = atom(false);

export const darkModeAtom = atomWithStorage(
  "commenstudio:darkMode",
  matchMedia("(prefers-color-scheme: dark)").matches,
);
export const studiosAtom = atomWithStorage<number[]>(
  "commenstudio:studios",
  [],
);
export const readToAtom = atomWithStorage("commenstudio:readTo", 0);
export const pinnedCommentsAtom = atomWithStorage<
  (CommentRepresentation & { studioName: string })[]
>("commenstudio:pinnedComments", []);
export const pinReasonsAtom = atomWithStorage<{ [k: string]: string }>(
  "commenstudio:pinReasons",
  {},
);
export const hideReadAtom = atomWithStorage("commenstudio:hideRead", false);

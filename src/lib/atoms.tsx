import { atomWithStorage } from "jotai/utils";
import { CommentRepresentation } from "./getComments";

export const studiosAtom = atomWithStorage<number[]>(
  "commenstudio:studios",
  [],
);
export const readToAtom = atomWithStorage("commenstudio:readTo", 0);
export const pinnedCommentsAtom = atomWithStorage<
  (CommentRepresentation & { studioName: string })[]
>("commenstudio:pinnedComments", []);

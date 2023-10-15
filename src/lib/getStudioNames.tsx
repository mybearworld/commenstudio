import { z } from "zod";
import { proxy } from "./proxy";

const storedStudios = new Map<number, string | null>();

const studioNameSchema = z.object({
  title: z.string(),
});

export const getStudioNames = async (studios: Set<number>) => {
  const studioNames = new Map<number, string>();
  for (const studio of studios) {
    const storedName = storedStudios.get(studio);
    if (storedName !== undefined) {
      if (storedName !== null) {
        studioNames.set(studio, storedName);
      }
      continue;
    }
    const response = await (
      await proxy(`https://api.scratch.mit.edu/studios/${studio}`)
    ).json();
    const parsedResponse = studioNameSchema.safeParse(response);
    if (!parsedResponse.success) {
      storedStudios.set(studio, null);
      continue;
    }
    storedStudios.set(studio, parsedResponse.data.title);
    studioNames.set(studio, parsedResponse.data.title);
  }
  return studioNames;
};

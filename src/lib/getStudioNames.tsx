import { z } from "zod";
import { proxy } from "./proxy";

const storedStudios = new Map<number, string>();

const studioNameSchema = z.object({
  title: z.string(),
});

export const getStudioNames = async (studios: Set<number>) => {
  const studioNames = new Map<number, string>();
  for (const studio of studios) {
    const storedName = storedStudios.get(studio);
    if (storedName) {
      studioNames.set(studio, storedName);
      continue;
    }
    const response = await (
      await proxy(`https://api.scratch.mit.edu/studios/${studio}`)
    ).json();
    const parsedResponse = studioNameSchema.parse(response);
    storedStudios.set(studio, parsedResponse.title);
    studioNames.set(studio, parsedResponse.title);
  }
  return studioNames;
};

import { z } from "zod";

const storedStudios = new Map<number, string>();

const studioNameSchema = z.object({
  title: z.string(),
});

export const getStudioName = async (studio: number) => {
  const storedName = storedStudios.get(studio);
  if (storedName) {
    return storedName;
  }
  const response = await (
    await fetch(
      `https://api.codetabs.com/v1/proxy?quest=https://api.scratch.mit.edu/studios/${studio}`,
    )
  ).json();
  const parsedResponse = studioNameSchema.parse(response);
  storedStudios.set(studio, parsedResponse.title);
  return parsedResponse.title;
};

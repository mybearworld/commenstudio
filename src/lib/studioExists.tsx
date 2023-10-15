import { z } from "zod";
import { proxy } from "./proxy";

const notFoundSchema = z.object({ code: z.literal("NotFound") });

export const studioExists = async (id: number) => {
  const response = await (
    await proxy(`https://api.scratch.mit.edu/studios/${id}`)
  ).json();
  const parsedResponse = notFoundSchema.safeParse(response);
  console.log(parsedResponse.success);
  return !parsedResponse.success;
};

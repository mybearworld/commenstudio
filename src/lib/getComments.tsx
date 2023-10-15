import { z } from "zod";
import { proxy } from "./proxy";

const commentResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  datetime_created: z.string().datetime(),
  author: z.object({
    id: z.number(),
    username: z.string(),
    scratchteam: z.boolean(),
    image: z.string().url(),
  }),
  reply_count: z.number(),
});

export type CommentRepresentation = z.infer<typeof commentResponseSchema> & {
  studio: number;
};

export const getComments = async (studios: number[], page: number = 0) => {
  const studioComments = await Promise.all(
    [...new Set(studios)].map(async (studio) => {
      const comments = await (
        await proxy(
          `https://api.scratch.mit.edu/studios/${studio}/comments?limit=40&offset=${
            40 * page
          }`,
        )
      ).json();
      const parsedComments = commentResponseSchema.array().safeParse(comments);
      if (!parsedComments.success) {
        return [];
      }
      return parsedComments.data.map((comment) => ({ ...comment, studio }));
    }),
  );
  let allComments: CommentRepresentation[] = [];
  allComments = allComments.concat(...studioComments).sort((a, b) => {
    const dateA = new Date(a.datetime_created).getTime();
    const dateB = new Date(b.datetime_created).getTime();
    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  });
  return allComments;
};

export const getReplies = async (studio: number, comment: number) => {
  const response = await (
    await proxy(
      `https://api.scratch.mit.edu/studios/${studio}/comments/${comment}/replies`,
    )
  ).json();
  const parsedResponse = commentResponseSchema.array().parse(response);
  return parsedResponse.map((response) => ({
    ...response,
    studio,
  })) satisfies CommentRepresentation[];
};

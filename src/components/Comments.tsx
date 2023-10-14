import { useEffect, useState } from "preact/hooks";
import { studiosAtom } from "../atoms";
import { useAtom } from "jotai";
import { z } from "zod";

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

type CommentResponse = z.infer<typeof commentResponseSchema>;

export function Comments() {
  const [studios] = useAtom(studiosAtom);
  const [comments, setComments] = useState<CommentResponse[]>([]);

  useEffect(() => {
    (async () => {
      const studioComments = await Promise.all(
        studios.map(async (studio) => {
          const comments = await (
            await fetch(
              `https://corsproxy.io?https://api.scratch.mit.edu/studios/${studio}/comments`,
            )
          ).json();
          return commentResponseSchema.array().parse(comments);
        }),
      );
      console.log({ studioComments });
      let allComments: CommentResponse[] = [];
      allComments = allComments.concat(...studioComments);
      console.log({ allComments });
      setComments(allComments);
    })();
  }, [studios]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  return (
    <div class="space-y-2">
      <h2 class="text-xl font-bold">Comments</h2>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment}></Comment>
      ))}
    </div>
  );
}

function Comment({ content }: CommentResponse) {
  return (
    <div
      class="rounded-xl bg-stone-300 px-2 py-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

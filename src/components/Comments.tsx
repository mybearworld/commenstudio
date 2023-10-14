import { useEffect, useState } from "preact/hooks";
import { studiosAtom } from "../atoms";
import { useAtom } from "jotai";

type CommentResponse = {
  content: string;
};

export function Comments() {
  const [studios] = useAtom(studiosAtom);
  const [comments, setComments] = useState<CommentResponse[]>([]);

  useEffect(() => {
    setComments(
      studios.map((studio) => ({
        content: studio.toString(),
      })),
    );
  }, [studios]);

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
  return <div class="rounded-xl bg-stone-300 px-2 py-1">{content}</div>;
}

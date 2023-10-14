import { useEffect, useState } from "preact/hooks";
import { studiosAtom } from "../lib/atoms";
import { useAtom } from "jotai";
import { getComments, CommentRepresentation } from "../lib/getComments";
import { formatRelative } from "../lib/formatRelative";
import gobo from "../emoji/gobo.png";
import meow from "../emoji/meow.png";
import waffle from "../emoji/waffle.png";

export function Comments() {
  const [studios] = useAtom(studiosAtom);
  const [comments, setComments] = useState<CommentRepresentation[]>([]);

  useEffect(() => {
    (async () => {
      setComments(await getComments(studios));
    })();
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

function Comment({
  id,
  content,
  datetime_created,
  author,
  reply_count,
  studio,
}: CommentRepresentation) {
  const userLink = `https://scratch.mit.edu/users/${author.username}`;
  const emojiContent = content
    .replace(/<img src="\/images\/emoji\/meow.png"/g, `<img src="${meow}"`)
    .replace(/<img src="\/images\/emoji\/gobo.png"/g, `<img src="${gobo}"`)
    .replace(/<img src="\/images\/emoji\/waffle.png"/g, `<img src="${waffle}"`)
    .replace(
      /<img src="\/images\/emoji/g,
      '<img src="https://scratch.mit.edu/images/emoji',
    )
    .replace(/<img/g, '<img class="inline-block max-w-[24px]"');
  const createdDate = new Date(datetime_created);
  return (
    <div class="flex items-center gap-2 rounded-xl bg-stone-300 px-2 py-1">
      <a href={userLink}>
        <img
          class="h-12 min-h-[theme(spacing.12)] w-12 min-w-[theme(spacing.12)]"
          src={author.image}
          alt={`${author.username}'s profile picture`}
        />
      </a>
      <div>
        <a href={userLink} class="font-bold text-sky-600 hover:underline">
          {author.username}
        </a>
        <p
          dangerouslySetInnerHTML={{ __html: emojiContent }}
          style={{ overflowWrap: "anywhere" }}
        ></p>
        <a
          class="font-bold text-sky-600 hover:underline"
          target="_blank"
          href={`https://scratch.mit.edu/studios/${studio}/comments/#comments-${id}`}
        >
          reply ({reply_count}/25)
        </a>{" "}
        -{" "}
        <span title={createdDate.toISOString()}>
          {formatRelative(createdDate)}
        </span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "preact/hooks";
import { studiosAtom, readToAtom, pinnedCommentsAtom } from "../lib/atoms";
import { useAtom } from "jotai";
import { getComments, CommentRepresentation } from "../lib/getComments";
import { getStudioNames } from "../lib/getStudioNames";
import { formatRelative } from "../lib/formatRelative";
import gobo from "../emoji/gobo.png";
import meow from "../emoji/meow.png";
import pin from "../emoji/pin.svg";
import waffle from "../emoji/waffle.png";

export function Comments() {
  const [studios] = useAtom(studiosAtom);
  const [pinnedComments] = useAtom(pinnedCommentsAtom);
  const [comments, setComments] = useState<CommentRepresentation[]>([]);
  const [page, setPage] = useState(0);
  const [studioNames, setStudioNames] = useState<Map<number, string>>(
    new Map(),
  );

  useEffect(() => {
    (async () => {
      setComments(await getComments(studios, page));
      setStudioNames(await getStudioNames(new Set(studios)));
    })();
  }, [studios, page]);

  const handlePreviousPage = () => {
    setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    setPage((p) => p + 1);
  };

  return (
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-bold">
        Comments (
        {page === 0 ? (
          <>&laquo;</>
        ) : (
          <button
            class="font-bold text-sky-600 hover:underline"
            type="button"
            onClick={handlePreviousPage}
          >
            &laquo;
          </button>
        )}{" "}
        {page + 1}{" "}
        {comments.length === 0 ? (
          <>&raquo;</>
        ) : (
          <button
            class="font-bold text-sky-600 hover:underline"
            type="button"
            onClick={handleNextPage}
          >
            &raquo;
          </button>
        )}
        )
      </h2>
      {pinnedComments.length === 0 ? null : (
        <div class="mb-4 space-y-2">
          {" "}
          {pinnedComments.map((comment, index) => (
            <Comment key={index} {...comment} />
          ))}
        </div>
      )}
      {comments.length === 0 ? (
        <p class="w-full text-lg italic">
          {studios.length === 0
            ? "Add some studios on the left!"
            : page === 0
            ? "There are no comments here."
            : "No comments left."}
        </p>
      ) : (
        comments.map((comment, index) => (
          <Comment
            key={index}
            {...comment}
            studioName={studioNames.get(comment.studio) ?? ""}
            showIfPinned={false}
          ></Comment>
        ))
      )}
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
  studioName,
  showIfPinned = true,
}: CommentRepresentation & { studioName: string; showIfPinned?: boolean }) {
  const [readTo, setReadTo] = useAtom(readToAtom);
  const [pinnedComments, setPinnedComments] = useAtom(pinnedCommentsAtom);
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
  const isRead = createdDate.getTime() <= readTo;
  const pinEntry = pinnedComments.find((comment) => comment.id === id);
  const isPinned = !!pinEntry;

  if (isPinned && !showIfPinned) {
    return null;
  }

  const handleMarkAsRead = () => {
    setReadTo(createdDate.getTime());
  };

  const handleTogglePin = () => {
    if (isPinned) {
      const index = pinnedComments.indexOf(pinEntry);
      setPinnedComments([
        ...pinnedComments.slice(0, index),
        ...pinnedComments.slice(index + 1),
      ]);
    } else {
      const newPinnedComments = [...pinnedComments];
      newPinnedComments.push({
        id,
        content,
        datetime_created,
        author,
        reply_count,
        studio,
        studioName,
      });
      setPinnedComments(newPinnedComments);
    }
  };

  return (
    <div
      class={`flex w-full items-center gap-2 rounded-xl bg-stone-300 px-2 py-1 ${
        isRead && !isPinned ? "opacity-80" : ""
      }`}
    >
      <a href={userLink}>
        <img
          class="h-12 min-h-[theme(spacing.12)] w-12 min-w-[theme(spacing.12)]"
          src={author.image}
          alt={`${author.username}'s profile picture`}
        />
      </a>
      <div>
        <span class="flex items-center gap-2">
          {isPinned ? (
            <img
              class="inline-block h-4 w-4"
              src={pin}
              title="Pinned"
              alt="Pin emoji"
            ></img>
          ) : null}
          <a href={userLink} class="font-bold text-sky-600 hover:underline">
            {author.username}
          </a>
          <span class="italic">{studioName}</span>
        </span>
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
        </span>{" "}
        -{" "}
        {isRead ? (
          "Read"
        ) : (
          <button
            class="font-bold text-sky-600 hover:underline"
            type="button"
            onClick={handleMarkAsRead}
          >
            Mark as read
          </button>
        )}{" "}
        -{" "}
        <button
          class="font-bold text-sky-600 hover:underline"
          onClick={handleTogglePin}
        >
          {isPinned ? "Unpin" : "Pin"}
        </button>
      </div>
    </div>
  );
}

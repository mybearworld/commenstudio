import { useEffect, useRef, useState } from "preact/hooks";
import { useAtom } from "jotai";
import linkifyHtml from "linkify-html";
import {
  notificationsAtom,
  studiosAtom,
  readToAtom,
  pinnedCommentsAtom,
  pinReasonsAtom,
  hideReadAtom,
} from "../lib/atoms";
import { getComments, CommentRepresentation } from "../lib/getComments";
import { emojiTextToEmoji } from "../lib/emojiTextToEmoji";
import { getStudioNames } from "../lib/getStudioNames";
import { formatRelative } from "../lib/formatRelative";
import gobo from "../emoji/gobo.png";
import meow from "../emoji/meow.png";
import pin from "../emoji/pin.svg";
import waffle from "../emoji/waffle.png";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

export function Comments() {
  const [studios] = useAtom(studiosAtom);
  const [pinnedComments] = useAtom(pinnedCommentsAtom);
  const [notifications] = useAtom(notificationsAtom);
  const [comments, setComments] = useState<CommentRepresentation[]>([]);
  const [page, setPage] = useState(0);
  const [studioNames, setStudioNames] = useState<Map<number, string>>(
    new Map(),
  );
  const [currentInterval, setCurrentInterval] = useState<number | null>(null);
  const notificationsTextElement = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    setCurrentInterval(
      setInterval(
        async () => {
          if (page !== 0 || !notifications) {
            return;
          }
          const newComments = await getComments(studios, page);
          const isNew = newComments[0].id !== comments[0].id;
          if (!isNew) {
            return;
          }
          const oldCommentsStart =
            newComments
              .map((comment, index) => ({
                ...comment,
                index,
              }))
              .find((comment) => comments[0].id === comment.id)?.index ?? 0;
          const addedComments = newComments.slice(0, oldCommentsStart);
          console.log(newComments, comments, addedComments);
          addedComments.forEach((comment) => {
            if (!notificationsTextElement.current) {
              return;
            }
            notificationsTextElement.current.innerHTML = emojiTextToEmoji(
              comment.content,
            );
            new Notification(
              `New comment from ${studioNames.get(comment.studio)}`,
              {
                body: `${comment.author.username}: "${notificationsTextElement.current.textContent}"`,
                icon: comment.author.image,
              },
            );
          });
          setComments(newComments);
        },
        1.5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND,
      ),
    );
  }, [studios, comments, page, notifications, studioNames]);

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
      <span class="hidden" ref={notificationsTextElement}></span>
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
            ? "Add some studio IDs on the left! The comments from them will appear over here."
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
  const [hideRead] = useAtom(hideReadAtom);
  const [readTo, setReadTo] = useAtom(readToAtom);
  const [pinReasons, setPinReasons] = useAtom(pinReasonsAtom);
  const [pinnedComments, setPinnedComments] = useAtom(pinnedCommentsAtom);
  const pinReasonInput = useRef<HTMLInputElement>(null);
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
  const finalContent = linkifyHtml(emojiContent, {
    className: "font-bold text-sky-600 hover:underline",
    defaultProtocol: "https",
  });
  const createdDate = new Date(datetime_created);
  const isRead = createdDate.getTime() <= readTo;
  const pinEntry = pinnedComments.find((comment) => comment.id === id);
  const isPinned = !!pinEntry;

  if ((isPinned && !showIfPinned) || (isRead && hideRead)) {
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

  const handlePinReason = () => {
    if (!pinReasonInput.current) {
      return;
    }
    const pinReason = pinReasonInput.current.value;
    const newPinReasons = { ...pinReasons };
    newPinReasons[id.toString()] = pinReason;
    console.log(newPinReasons);
    setPinReasons(newPinReasons);
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
          dangerouslySetInnerHTML={{ __html: finalContent }}
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
        {isPinned ? (
          <input
            class="ml-2 rounded-xl bg-stone-200 px-2 py-1"
            placeholder="Pin reason"
            onChange={handlePinReason}
            value={pinReasons[id] ?? ""}
            ref={pinReasonInput}
          />
        ) : null}
      </div>
    </div>
  );
}

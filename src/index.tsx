import { render } from "preact";
import { useAtom } from "jotai";
import { Studios } from "./components/Studios";
import { Comments } from "./components/Comments";
import { notificationsAtom, readToAtom } from "./lib/atoms";
import "./index.css";
import { useEffect } from "preact/hooks";

export function App() {
  return (
    <>
      <header class="mb-2 flex items-center gap-2">
        <h1 class="text-3xl font-bold">Commenstudio</h1>
        <nav>
          <a
            href="https://github.com/mybearworld/commenstudio"
            class="font-bold text-sky-600 hover:underline"
          >
            Github
          </a>
          <span class="font-bold"> - </span>
          <a
            href="https://scratch.mit.edu/discuss/topic/717430"
            class="font-bold text-sky-600 hover:underline"
          >
            Topic
          </a>
        </nav>
      </header>
      <div class="flex max-w-full gap-8">
        <div class="min-w-[theme(spacing.48)]">
          <Studios />
          <div class="mt-4 flex flex-col items-start">
            <ResetReadDate />
            <Notifications />
          </div>
        </div>
        <div class="flex-1">
          <Comments />
        </div>
      </div>
    </>
  );
}

function ResetReadDate() {
  const [readTo, setReadTo] = useAtom(readToAtom);

  const handleClick = () => {
    if (
      confirm(
        "Are you sure you want to reset your read date? Every comment will appear as unread if you do this.",
      )
    ) {
      setReadTo(0);
    }
  };

  return (
    <button
      class="font-bold text-sky-600 hover:underline"
      type="button"
      onClick={handleClick}
    >
      Reset read date
    </button>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setNotifications(true);
    }
  }, []);

  const handleClick = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("cool");
      setNotifications(true);
    }
  };

  return (
    <>
      {notifications ? null : (
        <button
          class="font-bold text-sky-600 hover:underline"
          type="button"
          onClick={handleClick}
        >
          Enable notifications
        </button>
      )}
    </>
  );
}

render(<App />, document.getElementById("app")!);

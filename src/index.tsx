import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useAtom } from "jotai";
import { Studios } from "./components/Studios";
import { Comments } from "./components/Comments";
import {
  darkModeAtom,
  notificationsAtom,
  readToAtom,
  hideReadAtom,
} from "./lib/atoms";
import "./index.css";

export function App() {
  return (
    <>
      <header class="mb-2 flex items-center justify-between gap-2">
        <nav class="flex items-center gap-2">
          <h1 class="inline-block text-3xl font-bold">Commenstudio</h1>
          <a
            href="https://github.com/mybearworld/commenstudio"
            class="font-bold text-sky-600 hover:underline dark:text-sky-500"
          >
            Github
          </a>
          <a
            href="https://scratch.mit.edu/discuss/topic/717430"
            class="font-bold text-sky-600 hover:underline dark:text-sky-500"
          >
            Topic
          </a>
        </nav>
        <ThemeSwitch />
      </header>
      <div class="flex max-w-full gap-8">
        <div class="min-w-[theme(spacing.48)]">
          <Studios />
          <div class="mt-4 flex flex-col items-start">
            <ResetReadDate />
            <Notifications />
            <HideRead />
          </div>
        </div>
        <div class="flex-1">
          <Comments />
        </div>
      </div>
    </>
  );
}

function ThemeSwitch() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const handleClick = () => {
    setDarkMode(!darkMode);
  };
  return (
    <button
      class="font-bold text-sky-600 hover:underline dark:text-sky-500"
      onClick={handleClick}
    >
      {darkMode ? "Light mode" : "Dark mode"}
    </button>
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
      class="font-bold text-sky-600 hover:underline dark:text-sky-500"
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
          class="font-bold text-sky-600 hover:underline dark:text-sky-500"
          type="button"
          onClick={handleClick}
        >
          Enable notifications
        </button>
      )}
    </>
  );
}

function HideRead() {
  const [hideRead, setHideRead] = useAtom(hideReadAtom);
  const checkbox = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!checkbox.current) {
      return;
    }
    setHideRead(checkbox.current.checked);
  };

  return (
    <label>
      Hide read comments:
      <input
        type="checkbox"
        class="ml-2"
        onClick={handleClick}
        checked={hideRead}
        ref={checkbox}
      />
    </label>
  );
}

render(<App />, document.getElementById("app")!);

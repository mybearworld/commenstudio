import { render } from "preact";
import { useAtom } from "jotai";
import { Studios } from "./components/Studios";
import { Comments } from "./components/Comments";
import { readToAtom } from "./lib/atoms";
import "./index.css";

export function App() {
  return (
    <>
      <header class="mb-2 flex items-center gap-2">
        <h1 class="text-3xl font-bold">Communistudio</h1>
        <nav>
          <a
            href="https://github.com/mybearworld/communistudio"
            class="font-bold text-sky-600 hover:underline"
          >
            Github
          </a>
        </nav>
      </header>
      <div class="flex max-w-full gap-8">
        <div class="min-w-[theme(spacing.48)]">
          <Studios />
          <div class="mt-4">
            <ResetReadDate />
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
      onClick={handleClick}
    >
      Reset read date
    </button>
  );
}

render(<App />, document.getElementById("app")!);

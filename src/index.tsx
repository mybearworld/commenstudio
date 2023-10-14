import { render } from "preact";
import { Studios } from "./components/Studios";
import { Comments } from "./components/Comments";
import "./index.css";

export function App() {
  return (
    <div>
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
      <div class="flex gap-8">
        <div class="min-w-[theme(spacing.48)]">
          <Studios />
        </div>
        <div class="flex-grow">
          <Comments />
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app")!);

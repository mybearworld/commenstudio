import { render } from "preact";
import { Studios } from "./Studios";
import "./index.css";

export function App() {
  return (
    <div>
      <header class="mb-2 flex items-center gap-2">
        <h1 class="text-3xl font-bold">Communistudio</h1>
        <nav class="font-bold text-sky-600">
          <a
            href="https://github.com/mybearworld/communistudio"
            class="hover:underline"
          >
            Github
          </a>
        </nav>
      </header>
      <div class="flex gap-2">
        <div class="w-48">
          <Studios />
        </div>
        <div class="flex-grow bg-red-500/20">(placeholder for comments)</div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));

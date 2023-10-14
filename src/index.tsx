import { render } from "preact";
import "./index.css";

export function App() {
  return (
    <div>
      <header class="flex gap-2 items-center">
        <h1 class="font-bold text-3xl">Communistudio</h1>
        <nav class="text-sky-600 font-bold">
          <a
            href="https://github.com/mybearworld/communistudio"
            class="hover:underline"
          >
            Github
          </a>
        </nav>
      </header>
    </div>
  );
}

render(<App />, document.getElementById("app"));

import { render } from "preact";
import "./index.css";

export function App() {
  return (
    <div>
      <header class="flex items-center gap-2">
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
    </div>
  );
}

render(<App />, document.getElementById("app"));

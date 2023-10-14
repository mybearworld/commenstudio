import { useAtom } from "jotai";
import { studiosAtom } from "../lib/atoms";

export function Studios() {
  const [studios, setStudios] = useAtom(studiosAtom);

  const handleInput = (target: EventTarget, index: number) => {
    const element = target as HTMLInputElement;
    const value = Number(element.value);
    if (value.toString() !== element.value) {
      element.value = studios[index].toString();
    }
    setStudios([
      ...studios.slice(0, index),
      value,
      ...studios.slice(index + 1),
    ]);
  };

  const handleNewStudio = () => {
    const newStudios = [...studios];
    newStudios.push(1234);
    setStudios(newStudios);
  };

  const handleStudioDelete = (index: number) => {
    setStudios([...studios.slice(0, index), ...studios.slice(index + 1)]);
  };

  return (
    <div class="flex flex-col items-end gap-2">
      <h2 class="text-xl font-bold">Studios: {studios.length}</h2>
      {studios.length > 0 ? (
        <ul class="contents">
          {studios.map((studio, index) => (
            <li class="flex w-full justify-between gap-2" key={index}>
              <input
                class="w-32 rounded-xl bg-stone-300 px-2 py-1"
                type="number"
                value={studio}
                onChange={(e) =>
                  handleInput(e.target as HTMLInputElement, index)
                }
              />
              <button
                onClick={(e) => handleStudioDelete(index)}
                class="font-bold text-sky-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        class="font-bold text-sky-600 hover:underline"
        type="button"
        onClick={handleNewStudio}
      >
        New
      </button>
    </div>
  );
}

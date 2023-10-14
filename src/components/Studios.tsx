import { useAtom } from "jotai";
import { studiosAtom, studioColorsAtom } from "../lib/atoms";
import { studioExists } from "../lib/studioExists";
import { useEffect, useRef, useState } from "preact/hooks";

export function Studios() {
  const [studios, setStudios] = useAtom(studiosAtom);

  const handleNewStudio = () => {
    const newStudios = [...studios];
    newStudios.push(1234);
    setStudios(newStudios);
  };

  return (
    <div class="flex flex-col items-end gap-2">
      <h2 class="text-xl font-bold">Studios: {studios.length}</h2>
      {studios.length > 0 ? (
        <ul class="contents">
          {studios.map((studio, index) => (
            <li class="flex w-full" key={index}>
              <StudioInput studio={studio} index={index} />
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

function StudioInput({ studio, index }: { studio: number; index: number }) {
  const [studios, setStudios] = useAtom(studiosAtom);
  const [studioColors, setStudioColors] = useAtom(studioColorsAtom);
  const [invalid, setInvalid] = useState(false);
  const element = useRef<HTMLInputElement>(null);
  const colorPicker = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      if (!element.current) {
        return;
      }
      if (!(await studioExists(Number(element.current.value)))) {
        setInvalid(true);
      }
    })();
  });

  const handleInput = async () => {
    if (!element.current) {
      return;
    }
    const value = element.current.value;
    const numberValue = Number(value);
    if (value.toString() !== value) {
      element.current.value = studios[index].toString();
    }
    if (!(await studioExists(numberValue))) {
      setInvalid(true);
    }
    setStudios([
      ...studios.slice(0, index),
      numberValue,
      ...studios.slice(index + 1),
    ]);
    if (invalid) {
      setInvalid(false);
    }
  };

  const handleStudioDelete = () => {
    setStudios([...studios.slice(0, index), ...studios.slice(index + 1)]);
  };

  const handleColorChange = () => {
    if (!colorPicker.current) {
      return;
    }
    const color = colorPicker.current.value;
    setStudioColors({
      ...studioColors,
      [studios[index]]: { color },
    });
  };

  const handleRemoveColor = () => {
    const newStudioColors = { ...studioColors };
    delete newStudioColors[studios[index]];
    setStudioColors(newStudioColors);
  };

  return (
    <div class="w-full">
      <div class="flex w-full justify-between">
        <input
          class={`w-32 rounded-xl bg-stone-300 px-2 py-1 ${
            invalid ? "ring ring-red-400 focus-visible:outline-red-700" : ""
          }`}
          type="number"
          value={studio}
          onChange={(e) => handleInput()}
          ref={element}
        />
        <button
          onClick={() => handleStudioDelete()}
          type="button"
          class="font-bold text-sky-600 hover:underline"
        >
          Delete
        </button>
      </div>
      <div class="flex w-full justify-between">
        <div class="flex items-center gap-1">
          <span>Color:</span>
          <input
            type="color"
            class="w-5 cursor-pointer bg-transparent p-0"
            onChange={handleColorChange}
            value={
              studios[index] in studioColors
                ? studioColors[studios[index]].color
                : "#333333"
            }
            ref={colorPicker}
          />
        </div>
        {studios[index] in studioColors ? (
          <button
            class="font-bold text-sky-600 hover:underline"
            type="button"
            onClick={handleRemoveColor}
          >
            Remove color
          </button>
        ) : (
          "No color set"
        )}
      </div>
    </div>
  );
}

import clsx from "clsx";
import {
  bgColor,
  color,
  colorful,
  setBgColor,
  setColor,
  setColorful,
  setThreshold,
  setTransparent,
  threshold,
  transparent,
} from "../states/color";
import {
  setOutputWidth,
  setOutputHeight,
  outputWidth,
  outputHeight,
} from "../states/output-dimensions";

const ConfigOutput = () => {
  const onWidthChange = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setOutputWidth(Number(value));
  };

  const onHeightChange = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setOutputHeight(Number(value));
  };

  return (
    <>
      {/*Override Dimensions*/}
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            step="1"
            max="65535"
            placeholder="Width"
            class="input input-bordered flex-auto"
            onBlur={onWidthChange}
            value={outputWidth() ?? ""}
          />
          <span class="icon-[mdi--close] h-8 w-8"></span>
          <input
            type="number"
            min="1"
            step="1"
            max="65535"
            placeholder="Height"
            class="input input-bordered flex-auto"
            onBlur={onHeightChange}
            value={outputHeight() ?? ""}
          />
        </div>
      </div>
      {/*Override Color*/}
      <label class="input input-bordered flex gap-2 items-center w-full">
        <span>Change Color</span>
        <input
          class="self-stretch flex-auto h-auto"
          type="color"
          value={color()}
          onInput={(e) => setColor(e.target.value)}
        />
        <button
          type="button"
          class={clsx(
            "btn btn-square btn-sm text-error",
            color() || "btn-disabled",
          )}
          onClick={() => setColor(undefined)}>
          <span class="icon-[mdi--close-circle-outline] h-8 w-8"></span>
        </button>
      </label>
      {/*Background Color*/}
      <label class="input input-bordered flex gap-2 items-center w-full">
        <span>Background Color</span>
        <input
          class="self-stretch flex-auto h-auto"
          type="color"
          value={bgColor()}
          onInput={(e) => setBgColor(e.target.value)}
        />
        <button
          type="button"
          class={clsx(
            "btn btn-square btn-sm text-error",
            bgColor() || "btn-disabled",
          )}
          onClick={() => setBgColor(undefined)}>
          <span class="icon-[mdi--close-circle-outline] h-8 w-8"></span>
        </button>
      </label>
      {/*Threshold*/}
      <label class="input input-bordered flex gap-2 items-center w-full">
        <span>Threshold</span>
        <input
          class="w-full range-primary"
          type="range"
          min="0"
          max="255"
          value={threshold()}
          onInput={(e) => setThreshold(Number(e.target.value))}
        />
      </label>
      {/*Transparent And Colorful*/}
      <div class="flex gap-2 items-center w-full">
        <label class="input input-bordered flex gap-2 items-center w-full">
          <span>Transparent</span>
          <input
            class="toggle toggle-primary"
            type="checkbox"
            checked={transparent()}
            onChange={(e) => setTransparent(e.target.checked)}
          />
        </label>
        <label class="input input-bordered flex gap-2 items-center w-full">
          <span>Colorful</span>
          <input
            class="toggle toggle-primary"
            type="checkbox"
            checked={colorful()}
            onChange={(e) => setColorful(e.target.checked)}
          />
        </label>
      </div>
    </>
  );
};

export default ConfigOutput;

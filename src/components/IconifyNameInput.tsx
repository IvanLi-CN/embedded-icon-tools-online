import { iconifyName, setIconifyName } from "../states/iconify-name";
import {
  outputHeight,
  outputWidth,
  setOutputHeight,
  setOutputWidth,
} from "../states/output-dimissions";

const IconifyNameInput = () => {
  const onInput = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setIconifyName(value);
  };

  const onWidthChange = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setOutputWidth(Number(value));
  };

  const onHeightChange = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setOutputHeight(Number(value));
  };

  return (
    <div class="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Type Icon Name here"
        class="input input-bordered w-full"
        maxLength={100}
        onInput={onInput}
        value={iconifyName() ?? ""}
      />
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Width"
            class="input input-bordered"
            onBlur={onWidthChange}
            value={outputWidth() ?? ""}
          />
          <span class="icon-[mdi--close] h-8 w-8"></span>
          <input
            type="text"
            placeholder="Height"
            class="input input-bordered"
            onBlur={onHeightChange}
            value={outputHeight() ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default IconifyNameInput;

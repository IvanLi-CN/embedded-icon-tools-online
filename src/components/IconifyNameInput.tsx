import { iconifyName, setIconifyName } from "../states/iconify-name";

const IconifyNameInput = () => {
  const onInput = (e: InputEvent) => {
    const { value } = e.target as HTMLInputElement;

    setIconifyName(value);
  };

  const onSizeChange = (e: InputEvent) => {
    const { value } = e.target as HTMLInputElement;
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
            placeholder="Type Icon Name here"
            class="input input-bordered"
            onInput={onInput}
            value={iconifyName() ?? ""}
          />
          <span class="icon-[mdi--close] h-8 w-8"></span>
          <input
            type="text"
            placeholder="Type Icon Name here"
            class="input input-bordered"
            onInput={onInput}
            value={iconifyName() ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default IconifyNameInput;

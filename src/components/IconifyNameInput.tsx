import { iconifyName, setIconifyName } from "../states/iconify-name";

const IconifyNameInput = () => {
  const onInput = (e: Event) => {
    const { value } = e.target as HTMLInputElement;

    setIconifyName(value);
  };

  return (
    <input
      type="text"
      placeholder="Type Icon Name here"
      class="input input-bordered w-full"
      maxLength={100}
      onInput={onInput}
      value={iconifyName() ?? ""}
    />
  );
};

export default IconifyNameInput;

import { type Component } from "solid-js";
import { IconifyConverter } from "./components/IconifyConverter";
import IconifyNameInput from "./components/IconifyNameInput";

const App: Component = () => {
  return (
    <div class="grid grid-cols-2 sm:grid-cols-1 gap-4 m-8">
      <IconifyNameInput />
      <IconifyConverter />
    </div>
  );
};

export default App;

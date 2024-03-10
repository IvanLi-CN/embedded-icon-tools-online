import { type Component } from "solid-js";
import { IconifyConverter } from "./components/IconifyConverter";
import IconifyNameInput from "./components/IconifyNameInput";
import ConfigOutput from "./components/ConfigOutput";

const App: Component = () => {
  return (
    <div>
      <h1 class="text-3xl text-primary text-center m-8">Iconify to RGB565</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 m-8">
        <div class="flex flex-col gap-2">
          <IconifyNameInput />
          <ConfigOutput />
        </div>
        <IconifyConverter />
      </div>
    </div>
  );
};

export default App;

import { addDynamicIconSelectors } from "@iconify/tailwind";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, addDynamicIconSelectors()],
  daisyui: {
    themes: ["cupcake", "dim"],
    darkTheme: "dim",
  },
};

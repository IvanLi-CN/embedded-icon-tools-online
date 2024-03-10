import { parseStateFromUrl } from "./parse-state-from-url";

export const buildUrlPathname = (
  dto: {
    iconifyName?: string;
    outputWidth?: number;
    outputHeight?: number;
    color?: string;
  } = {},
) => {
  const parse = parseStateFromUrl();

  const merged = {
    iconifyName: "iconifyName" in dto ? dto.iconifyName : parse.iconifyName,
    outputWidth: "outputWidth" in dto ? dto.outputWidth : parse.outputWidth,
    outputHeight: "outputHeight" in dto ? dto.outputHeight : parse.outputHeight,
    color: "color" in dto ? dto.color : parse.color,
  };

  const targetUrl = new URL(location.href);

  if (merged.iconifyName !== undefined) {
    targetUrl.pathname = `iconify/${merged.iconifyName}`;
  }

  if (merged.outputWidth) {
    targetUrl.searchParams.set("width", merged.outputWidth.toString());
  } else {
    targetUrl.searchParams.delete("width");
  }

  if (merged.outputHeight) {
    targetUrl.searchParams.set("height", merged.outputHeight.toString());
  } else {
    targetUrl.searchParams.delete("height");
  }

  if (merged.color) {
    targetUrl.searchParams.set("color", merged.color);
  } else {
    targetUrl.searchParams.delete("color");
  }

  return targetUrl.href;
};

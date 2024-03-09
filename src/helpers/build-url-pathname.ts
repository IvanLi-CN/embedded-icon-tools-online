import { parseStateFromUrl } from "./parse-state-from-url";

export const buildUrlPathname = (
  dto: {
    iconifyName?: string;
    outputWidth?: number;
    outputHeight?: number;
  } = {},
) => {
  const parse = parseStateFromUrl();

  const merged = {
    iconifyName: "iconifyName" in dto ? dto.iconifyName : parse.iconifyName,
    outputWidth: "outputWidth" in dto ? dto.outputWidth : parse.outputWidth,
    outputHeight: "outputHeight" in dto ? dto.outputHeight : parse.outputHeight,
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

  return targetUrl.href;
};

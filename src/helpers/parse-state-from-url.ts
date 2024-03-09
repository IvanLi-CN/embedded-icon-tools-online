export const parseStateFromUrl = () => {
  const url = new URL(window.location.href);

  const matches = /iconify\/([^/]+)/.exec(window.location.pathname);

  let iconifyName: string | undefined;
  if (matches) {
    iconifyName = matches[1];
  }

  return {
    iconifyName,
    outputWidth: Number(url.searchParams.get("width")) || undefined,
    outputHeight: Number(url.searchParams.get("height")) || undefined,
  };
};

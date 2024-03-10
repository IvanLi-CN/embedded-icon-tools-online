import { Component } from "solid-js";
import { iconifyName } from "../states/iconify-name";

interface DownloadRGB565Props {
  imageData?: ImageData;
}

const DownloadRGB565: Component<DownloadRGB565Props> = (props) => {
  const download = () => {
    if (!props.imageData) {
      return;
    }

    const a = document.createElement("a");
    const arrayBuffer = new Uint8Array(props.imageData.data.length / 2);

    for (let i = 0; i < props.imageData.data.length; i += 4) {
      const r = props.imageData.data[i];
      const g = props.imageData.data[i + 1];
      const b = props.imageData.data[i + 2];

      const r5 = Math.round((r / 255) * 31);
      const g6 = Math.round((g / 255) * 63);
      const b5 = Math.round((b / 255) * 31);

      const p = i / 2;
      arrayBuffer[p + 1] = (r5 << 3) | (g6 >> 3);
      arrayBuffer[p] = (g6 << 5) | b5;
    }

    a.href = props.imageData
      ? URL.createObjectURL(new Blob([arrayBuffer], { type: "image/rgb565" }))
      : "";
    a.download = `${iconifyName()?.replace(/:/g, "_") ?? "Untitled"}.raw`;
    a.click();
  };

  return (
    <button
      class="btn btn-primary"
      disabled={!props.imageData}
      onClick={download}>
      Download RGB565
    </button>
  );
};

export default DownloadRGB565;

import { Component, createEffect, onCleanup } from "solid-js";
import { drawGridForCanvas } from "../helpers/canvas-grid";

interface SourcePreviewerProps {
  blob: Blob;
  width?: number;
  height?: number;
}

const SourcePreviewer: Component<SourcePreviewerProps> = (props) => {
  let canvasRef!: HTMLCanvasElement;

  createEffect(() => {
    const canvas = canvasRef;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("get context failed");
      return;
    }

    const dpr = window.devicePixelRatio;

    const width = props.width ?? 200;
    const height = props.height ?? 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawGridForCanvas(canvas);

    const url = URL.createObjectURL(props.blob);

    onCleanup(() => {
      URL.revokeObjectURL(url);
    });

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const max = Math.max(img.width, img.height);
      const drawWidth = (canvas.width / max) * img.width * 1 * 0.75;
      const drawHeight = (canvas.height / max) * img.height * 1 * 0.75;
      ctx?.drawImage(
        img,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    };
  });

  return <canvas ref={canvasRef} class="rounded-box" />;
};

export default SourcePreviewer;

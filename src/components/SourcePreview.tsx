import { Component, createEffect, onCleanup } from "solid-js";

interface SourcePreviewerProps {
  blob: Blob;
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
    canvas.width = 200 * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = "200px";
    canvas.style.height = "200px";

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 20; // 网格大小
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.fillStyle = "#e7e7e7";

    for (let x = 0; x < canvasWidth; x += gridSize) {
      for (
        let y = (x / gridSize) % 2 === 0 ? 0 : gridSize;
        y < canvasHeight;
        y += gridSize * 2
      ) {
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    }

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

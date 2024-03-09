export const drawGridForCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("get context failed");
    return;
  }

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
};

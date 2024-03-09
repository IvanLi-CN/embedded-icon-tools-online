export const thresholdConvert = (
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  threshold: number,
  mode: 0 | 1,
  transparent: 0 | 1,
) => {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3];

    if (mode === 0) {
      if (transparent) {
        const bit = alpha >= threshold ? 0 : 255;
        data[i] = bit;
        data[i + 1] = bit;
        data[i + 2] = bit;
        data[i + 3] = 255 - bit;
      } else {
        const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
        const bit = gray >= threshold ? 255 : 0;
        data[i] = bit;
        data[i + 1] = bit;
        data[i + 2] = bit;
        data[i + 3] = 255;
      }
    } else {
      if (transparent) {
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
      } else {
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

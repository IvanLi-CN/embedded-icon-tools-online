import { Show, createEffect, createSignal, from, onCleanup } from "solid-js";
import { iconifyName$ } from "../states/iconify-name";
import { fromFetch } from "rxjs/fetch";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
} from "rxjs";
import SourcePreviewer from "./SourcePreview";
import { drawGridForCanvas } from "../helpers/canvas-grid";
import { outputHeight, outputWidth } from "../states/output-dimissions";
import { thresholdConvert } from "../helpers/threshold-convert";
import DownloadRGB565 from "./DownloadRGB565";

const [errorMsg, setErrorMsg] = createSignal<string | undefined>(undefined);

export const IconifyConverter = () => {
  const iconBuffer$ = iconifyName$.pipe(
    distinctUntilChanged(),
    debounceTime(500),
    filter(Boolean),
    map((name) => name.split(":")),
    switchMap(([prefix, name]) =>
      fromFetch(`https://api.iconify.design/${prefix}/${name}.svg`, {
        selector: (res) => res.arrayBuffer(),
      }).pipe(
        catchError((err) => {
          console.error(err);
          setErrorMsg(err.message);
          return of(null);
        }),
      ),
    ),
  );

  const blob = from(
    iconBuffer$.pipe(
      map((buffer) =>
        buffer ? new Blob([buffer], { type: "image/svg+xml" }) : null,
      ),
    ),
  );

  const [imageData, setImageData] = createSignal<ImageData | undefined>(
    undefined,
  );

  let canvasRef!: HTMLCanvasElement;

  createEffect(() => {
    onCleanup(() => {
      setImageData(undefined);
    });

    const canvas = canvasRef;

    const width = 200;
    const height = 200;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("get context failed");
      return;
    }

    const _blob = blob();

    if (!_blob) {
      return;
    }

    const url = URL.createObjectURL(_blob);

    onCleanup(() => {
      URL.revokeObjectURL(url);
    });

    const imgWidth = outputWidth();
    const imgHeight = outputHeight();

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const _imgWidth = imgWidth ?? img.width;
      const _imgHeight = imgHeight ?? img.height;

      canvas.width = _imgWidth;
      canvas.height = _imgHeight;

      ctx.imageSmoothingEnabled = false;
      const transparent = 0;
      if (!transparent) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, _imgWidth, _imgHeight);
      }
      ctx.drawImage(img, 0, 0, _imgWidth, _imgHeight);

      const imageData = ctx.getImageData(0, 0, _imgWidth, _imgHeight);
      thresholdConvert(ctx, imageData, 128, 1, transparent);
      setImageData(imageData);

      const resultImage = new Image();
      resultImage.src = canvas.toDataURL("image/png");

      resultImage.onload = () => {
        const dpr = window.devicePixelRatio;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.imageSmoothingEnabled = false;
        drawGridForCanvas(canvas);

        const max = Math.max(_imgWidth, _imgHeight);
        const drawWidth = (canvas.width / max) * _imgWidth * 1 * 0.75;
        const drawHeight = (canvas.height / max) * _imgHeight * 1 * 0.75;
        ctx?.drawImage(
          resultImage,
          (canvas.width - drawWidth) / 2,
          (canvas.height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      };
    };
  });

  return (
    <div>
      <div class="flex flex-row gap-2">
        <Show when={blob()}>
          <SourcePreviewer blob={blob()!} />
        </Show>
        <canvas ref={canvasRef} class="rounded-box" />
      </div>
      <Show when={errorMsg()}>
        <div class="alert alert-error shadow-lg">{errorMsg()}</div>
      </Show>
      <div>
        <DownloadRGB565 imageData={imageData()} />
      </div>
    </div>
  );
};

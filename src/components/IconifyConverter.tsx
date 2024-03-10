import { Show, createEffect, createSignal, from, onCleanup } from "solid-js";
import { iconifyName$ } from "../states/iconify-name";
import { fromFetch } from "rxjs/fetch";
import {
  catchError,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
} from "rxjs";
import SourcePreviewer from "./SourcePreview";
import { drawGridForCanvas } from "../helpers/canvas-grid";
import { outputHeight, outputWidth } from "../states/output-dimensions";
import { thresholdConvert } from "../helpers/threshold-convert";
import DownloadRGB565 from "./DownloadRGB565";
import {
  bgColor,
  color$,
  colorful,
  threshold,
  transparent,
} from "../states/color";

const [errorMsg, setErrorMsg] = createSignal<string | undefined>(undefined);

export const IconifyConverter = () => {
  const iconBuffer$ = iconifyName$.pipe(
    distinctUntilChanged(),
    debounceTime(500),
    filter(Boolean),
    map((name) => name.split(":")),
    combineLatestWith(color$),
    switchMap(([[prefix, name], color]) => {
      const url = new URL(`https://api.iconify.design/${prefix}/${name}.svg`);
      if (color) {
        url.searchParams.set("color", color);
      }
      return fromFetch(url.href, {
        selector: (res) => res.arrayBuffer(),
      }).pipe(
        catchError((err) => {
          console.error(err);
          setErrorMsg(err.message);
          return of(null);
        }),
      );
    }),
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
    const _transparent = transparent()!;
    const _colorful = colorful()!;
    const _threshold = threshold()!;
    const _bgColor = bgColor();

    const tmpCanvas = document.createElement("canvas");
    const tmpCtx = tmpCanvas.getContext("2d");

    if (!tmpCtx) {
      console.error("get tmpCtx failed");
      return;
    }
    onCleanup(() => {
      tmpCanvas.remove();
    });

    const img = new Image();
    img.src = url;
    img.onload = () => {
      img.onload = null;

      const _imgWidth = imgWidth ?? img.width;
      const _imgHeight = imgHeight ?? img.height;

      tmpCanvas.width = _imgWidth;
      tmpCanvas.height = _imgHeight;

      tmpCtx.imageSmoothingEnabled = false;
      if (!_transparent) {
        tmpCtx.fillStyle = _bgColor ?? "#fff";
        tmpCtx.fillRect(0, 0, _imgWidth, _imgHeight);
      }
      tmpCtx.drawImage(img, 0, 0, _imgWidth, _imgHeight);

      const imageData = tmpCtx.getImageData(0, 0, _imgWidth, _imgHeight);
      thresholdConvert(tmpCtx, imageData, _threshold, _colorful, _transparent);
      setImageData(imageData);

      const resultImage = new Image();
      resultImage.src = tmpCanvas.toDataURL("image/png");

      resultImage.onload = () => {
        resultImage.onload = null;
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
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2 justify-evenly">
        <Show when={blob()}>
          <SourcePreviewer blob={blob()!} />
        </Show>
        <canvas ref={canvasRef} class="rounded-box" />
      </div>
      <Show when={errorMsg()}>
        <div class="alert alert-error shadow-lg">{errorMsg()}</div>
      </Show>
      <div class="flex flex-row gap-2 justify-evenly">
        <DownloadRGB565 imageData={imageData()} />
      </div>
    </div>
  );
};

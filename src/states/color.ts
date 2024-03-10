import {
  BehaviorSubject,
  Subject,
  fromEvent,
  map,
  mergeWith,
  startWith,
} from "rxjs";
import { from } from "solid-js";
import { buildUrlPathname } from "../helpers/build-url-pathname";
import { parseStateFromUrl } from "../helpers/parse-state-from-url";

export const manualColor$ = new Subject<string | undefined>();
export const color$ = fromEvent(window, "popstate").pipe(
  startWith(void 0),
  mergeWith(manualColor$),
  map(() => {
    const parsed = parseStateFromUrl();
    return parsed.color || undefined;
  }),
);
export const color = from(color$);
export const setColor = (color: string | undefined) => {
  history.pushState({}, "", buildUrlPathname({ color }));
  manualColor$.next(color);
};

export const threshold$ = new BehaviorSubject<number>(128);
export const threshold = from(threshold$);
export const setThreshold = (threshold: number) => {
  threshold$.next(threshold);
};

export const transparent$ = new BehaviorSubject<boolean>(false);
export const transparent = from(transparent$);
export const setTransparent = (transparent: boolean) => {
  transparent$.next(transparent);
};

export const colorful$ = new BehaviorSubject<boolean>(false);
export const colorful = from(colorful$);
export const setColorful = (colorful: boolean) => {
  colorful$.next(colorful);
};

export const bgColor$ = new Subject<string | undefined>();
export const bgColor = from(bgColor$);
export const setBgColor = (bgColor: string | undefined) => {
  bgColor$.next(bgColor);
};

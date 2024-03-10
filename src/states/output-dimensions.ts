import { Subject, fromEvent, map, mergeWith, startWith } from "rxjs";
import { from } from "solid-js";
import { buildUrlPathname } from "../helpers/build-url-pathname";
import { parseStateFromUrl } from "../helpers/parse-state-from-url";

export const manualOutputWidth$ = new Subject<number>();
export const manualOutputHeight$ = new Subject<number>();

export const outputWidth$ = fromEvent(window, "popstate").pipe(
  startWith(void 0),
  mergeWith(manualOutputWidth$),
  map(() => {
    const parsed = parseStateFromUrl();
    return parsed.outputWidth || undefined;
  }),
);
export const outputHeight$ = fromEvent(window, "popstate").pipe(
  startWith(void 0),
  mergeWith(manualOutputHeight$),
  map(() => {
    const parsed = parseStateFromUrl();
    return parsed.outputHeight || undefined;
  }),
);

export const outputWidth = from(outputWidth$);
export const outputHeight = from(outputHeight$);

export const setOutputWidth = (outputWidth: number) => {
  history.pushState({}, "", buildUrlPathname({ outputWidth }));
  manualOutputWidth$.next(outputWidth);
};
export const setOutputHeight = (outputHeight: number) => {
  history.pushState({}, "", buildUrlPathname({ outputHeight }));
  manualOutputHeight$.next(outputHeight);
};

import { Subject, fromEvent, map, mergeWith, startWith } from "rxjs";
import { from } from "solid-js";
import { buildUrlPathname } from "../helpers/build-url-pathname";
import { parseStateFromUrl } from "../helpers/parse-state-from-url";

export const manualIconifyName$ = new Subject<string>();
export const iconifyName$ = fromEvent(window, "popstate").pipe(
  startWith(void 0),
  mergeWith(manualIconifyName$),
  map(() => {
    const parsed = parseStateFromUrl();

    return parsed.iconifyName || undefined;
  }),
);

export const iconifyName = from(iconifyName$);
export const setIconifyName = (iconifyName: string) => {
  history.pushState({}, "", buildUrlPathname({ iconifyName }));
  manualIconifyName$.next(iconifyName);
};

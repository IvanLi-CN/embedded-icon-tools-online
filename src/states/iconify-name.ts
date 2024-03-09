import { Subject, fromEvent, map, mergeWith, startWith } from "rxjs";
import { from } from "solid-js";

export const manualIconifyName$ = new Subject<string>();
export const iconifyName$ = fromEvent(window, "popstate").pipe(
  startWith(void 0),
  mergeWith(manualIconifyName$),
  map(() => {
    const matches = /\/iconify\/([^/]+)/.exec(window.location.pathname);

    return matches?.[1] ?? undefined;
  }),
);

export const iconifyName = from(iconifyName$);
export const setIconifyName = (name: string) => {
  history.pushState({}, "", `/iconify/${name}`);
  manualIconifyName$.next(name);
};

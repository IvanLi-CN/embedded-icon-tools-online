import { Show, createSignal, from } from "solid-js";
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

  return (
    <div>
      <Show when={blob()}>
        <div class="flex flex-row gap-2">
          <SourcePreviewer blob={blob()!} />
        </div>
      </Show>
      <Show when={errorMsg()}>
        <div class="alert alert-error shadow-lg">{errorMsg()}</div>
      </Show>
    </div>
  );
};

import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";

/**
 * Dedicated SSR entry used only by scripts/prerender.mjs.
 * Returns the static body markup for one route; metadata is injected by the
 * prerender script because this build has no DOM.
 */
export function renderRoute(pageId: string): string {
  return renderToStaticMarkup(<App initialPage={pageId} ssr />);
}

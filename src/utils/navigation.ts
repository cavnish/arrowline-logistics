export const SITE_URL = "https://www.arrowlinelogistics.in";

export function pageIdToPath(pageId: string): string {
  if (!pageId || pageId === "home" || pageId === "/") return "/";
  return `/${pageId.replace(/^\/+/, "")}`;
}

export function pathToPageId(pathname: string): string {
  const path = (pathname || "").split("?")[0].replace(/\/+$/, "") || "/";
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/services/")) {
    const slug = path.replace("/services/", "");
    return slug ? `services/${slug}` : "services/road-transportation";
  }
  const firstSegment = path.split("/").filter(Boolean)[0] || "home";
  return firstSegment;
}

export function navigate(pageId: string): void {
  const path = pageIdToPath(pageId);
  if (window.location.pathname !== path) {
    window.history.pushState({ pageId }, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
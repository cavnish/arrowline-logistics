import { useEffect, useState } from "react";

const API_URL = (import.meta as any).env?.VITE_API_URL || "";

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL.replace(/\/$/, "")}/api/content`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => setContent(Object.fromEntries((body.data || []).map((item: any) => [item.content_key, item.content_value]))))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return (key: string, fallback: string) => content[key] || fallback;
}

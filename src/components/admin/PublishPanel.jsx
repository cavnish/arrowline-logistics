import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Rocket } from "lucide-react";
import adminApi from "../../services/adminApi";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function PublishPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState(null);
  const [hookUrl, setHookUrl] = useState("");
  const [savingHook, setSavingHook] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const response = await adminApi.get("/publish/status");
      setStatus(response.data?.data || null);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handlePublish = async () => {
    const confirmed = window.confirm(
      "Publish the latest content?\n\nThis triggers a production rebuild from published Supabase rows. Drafts are excluded, and the current site stays live if the build fails."
    );
    if (!confirmed) return;

    setPublishing(true);
    setResult(null);
    try {
      const response = await adminApi.post("/publish", {
        reason: "Requested from the admin dashboard",
      });
      setResult({ ok: true, message: response.data?.message || "Deployment triggered." });
      await loadStatus();
    } catch (error) {
      setResult({
        ok: false,
        message:
          error?.response?.data?.message ||
          "Unable to trigger a deployment. Check the server logs and the Vercel deploy hook.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const saveHook = async (event) => {
    event.preventDefault();
    setSavingHook(true);
    setResult(null);
    try {
      await adminApi.put("/publish/config", { deployHookUrl: hookUrl.trim() });
      setHookUrl("");
      setResult({ ok: true, message: "Deploy hook saved. Publishing is now enabled." });
      await loadStatus();
    } catch (error) {
      setResult({
        ok: false,
        message:
          error?.response?.data?.message ||
          "Unable to save the deploy hook. Check the server logs.",
      });
    } finally {
      setSavingHook(false);
    }
  };

  const version = status?.deployedContentVersion;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-[#FF6B1A]">
              <Rocket className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Publish website content</h2>
              <p className="text-xs text-slate-500">
                Rebuilds all static routes from currently published Supabase rows.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="block font-semibold uppercase tracking-wide text-slate-400">Live content</span>
              <span className="mt-1 block font-mono text-[11px] text-slate-700">
                {version?.contentVersion || (loading ? "Loading…" : "Unavailable")}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="block font-semibold uppercase tracking-wide text-slate-400">Generated</span>
              <span className="mt-1 block text-slate-700">{formatDate(version?.generatedAt)}</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="block font-semibold uppercase tracking-wide text-slate-400">Last publish</span>
              <span className="mt-1 block text-slate-700">
                {formatDate(status?.lastTriggeredAt)}
                {status?.lastTriggeredBy ? ` · ${status.lastTriggeredBy}` : ""}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Draft and private rows are never exported. If the export or build fails, Vercel keeps the
            previous deployment live, so the public site never serves an empty snapshot.
          </p>

          {result && (
            <div
              className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                result.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {result.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2">
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || loading || status?.configured === false}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16306f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Rocket className="h-4 w-4" />
            {publishing ? "Triggering…" : "Publish latest content"}
          </button>
          <button
            type="button"
            onClick={loadStatus}
            disabled={publishing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh status
          </button>
          {status && status.configured === false && (
            <form onSubmit={saveHook} className="w-full max-w-[260px] space-y-2">
              <p className="text-[11px] leading-relaxed text-amber-700">
                Publishing is disabled. Create a Deploy Hook in Vercel
                (Project → Settings → Git → Deploy Hooks), then paste its URL
                here.
              </p>
              <input
                type="url"
                required
                value={hookUrl}
                onChange={(event) => setHookUrl(event.target.value)}
                placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] text-slate-700 outline-none focus:border-[#1E3A8A]"
              />
              <button
                type="submit"
                disabled={savingHook || !hookUrl.trim()}
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingHook ? "Saving…" : "Save deploy hook"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

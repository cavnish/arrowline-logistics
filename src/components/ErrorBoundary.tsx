import { Component, ReactNode } from "react";
import { TriangleAlert, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

/**
 * Catches render/lifecycle errors anywhere in the tree so a single page
 * failure can never unmount the whole app (previously a crash during boot
 * would leave the boot splash mounted forever → "stuck on loading screen").
 *
 * Renders a neutral recovery panel instead of a blank/stuck screen.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || "Unexpected error" };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("[ErrorBoundary] Caught error:", error, info?.componentStack || "");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F8FA] px-4 py-20 text-center">
          <div className="max-w-md">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#FF6B1A] mb-5 shadow-sm">
              <TriangleAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#062B3A] tracking-tight mb-2">
              Something Went Wrong
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {this.state.message || "An unexpected error interrupted this page."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-[#062B3A] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
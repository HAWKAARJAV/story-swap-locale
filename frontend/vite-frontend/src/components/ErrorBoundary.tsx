import React from 'react';

interface ErrorBoundaryState { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 font-medium">
          <h2 className="text-lg mb-2 font-semibold">Something went wrong.</h2>
          <p className="text-sm opacity-80 mb-4">The UI crashed. A safe fallback is shown. You can reload to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-500 transition"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

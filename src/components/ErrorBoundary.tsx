import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">We're sorry — please try refreshing the page.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-full border border-border text-foreground font-medium text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import * as React from 'react';
import { CircleWarningIcon } from '@constructor-lab/icons-react/stroke-mono';

interface ExampleErrorBoundaryProps {
  /** Shown in the fallback so a broken demo is identifiable. */
  name: string;
  children: React.ReactNode;
}

interface ExampleErrorBoundaryState {
  error: Error | null;
}

// A lightweight, inline boundary so a single broken auto-imported demo renders
// a compact notice instead of taking down the whole gallery page. (The app-wide
// ErrorBoundary renders a full-screen fallback, which is too heavy here.)
export class ExampleErrorBoundary extends React.Component<
  ExampleErrorBoundaryProps,
  ExampleErrorBoundaryState
> {
  state: ExampleErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ExampleErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Demo "${this.props.name}" failed to render:`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <CircleWarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">This demo failed to render.</p>
            <p className="font-mono text-xs text-muted-foreground">
              {this.state.error.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

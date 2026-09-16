import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Kaswah App:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearStorage = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c10] text-[#f8fafc] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141622] border border-[#232738] rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                The application encountered an unexpected issue while rendering. Don't worry, your data is safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#0e0f17] border border-[#1e2230] rounded-xl p-3 text-left">
                <p className="text-[11px] font-mono text-red-400 break-all line-clamp-3">
                  {this.state.error.message || 'Unknown error'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#e65500] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#ff6b00]/25"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload App</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearStorage}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1b1e2c] hover:bg-[#25293c] text-gray-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#2b3044]"
              >
                <Home className="w-4 h-4" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

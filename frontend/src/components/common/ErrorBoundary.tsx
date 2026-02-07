import { Component, type ReactNode } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and display React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start gap-3 mb-4">
                <FiAlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-red-900 mb-2">
                    Something went wrong
                  </h1>
                  <p className="text-sm text-red-700 mb-4">
                    The application encountered an unexpected error. Please try refreshing the page.
                  </p>
                  {this.state.error && (
                    <details className="mb-4">
                      <summary className="text-sm font-medium text-red-800 cursor-pointer mb-2">
                        Error details
                      </summary>
                      <pre className="text-xs bg-white p-3 rounded border border-red-300 overflow-auto">
                        {this.state.error.message}
                        {'\n\n'}
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                  <button
                    onClick={this.handleReset}
                    className="btn-primary w-full"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

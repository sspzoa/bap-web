'use client';

import { logger } from '@/utils/logger';
import Image from 'next/image';
import { Component, type ReactNode } from 'react';
import Glass from './Glass';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-[100dvh] flex items-center justify-center p-4">
          <Glass className="max-w-md w-full p-8 text-center">
            <Image src="/icon/dinner.svg" alt="Error" width={64} height={64} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">문제가 발생했어요</h2>
            <p className="text-lg mb-6 opacity-80">잠시 후 다시 시도해주세요</p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-6 py-3 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              새로고침
            </button>
          </Glass>
        </div>
      );
    }

    return this.props.children;
  }
}

export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    logger.error('Component error', {
      error: error.message,
      stack: error.stack,
      ...errorInfo,
    });
  };
}

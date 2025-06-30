enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  PERFORMANCE = 4,
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  duration?: number;
  [key: string]: any;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  context?: LogContext;
}

const LOG_LEVEL = (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) || 'INFO';
const CURRENT_LEVEL = LogLevel[LOG_LEVEL] || LogLevel.INFO;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class Logger {
  private context: LogContext = {};
  private performanceMetrics: PerformanceMetric[] = [];
  private sessionId: string;

  constructor(initialContext: LogContext = {}) {
    this.context = { ...initialContext };
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = this.formatContext({ ...this.context, ...context, sessionId: this.sessionId });
    return `[${timestamp}] [${level}]${contextStr} ${message}`;
  }

  private formatContext(context?: LogContext): string {
    if (!context) return '';

    const parts: string[] = [];
    if (context.component) parts.push(`comp=${context.component}`);
    if (context.action) parts.push(`action=${context.action}`);
    if (context.duration) parts.push(`${context.duration}ms`);

    return parts.length > 0 ? ` [${parts.join(' ')}]` : '';
  }

  child(additionalContext: LogContext): Logger {
    const childLogger = new Logger({ ...this.context, ...additionalContext });
    childLogger.sessionId = this.sessionId;
    return childLogger;
  }

  debug(message: string, data?: any): void {
    if (CURRENT_LEVEL <= LogLevel.DEBUG && !IS_PRODUCTION) {
      console.debug(this.formatMessage('DEBUG', message), data);
    }
  }

  info(message: string, data?: any): void {
    if (CURRENT_LEVEL <= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message), data);
    }
  }

  warn(message: string, data?: any): void {
    if (CURRENT_LEVEL <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message), data);
    }
  }

  error(message: string, error?: any): void {
    if (CURRENT_LEVEL <= LogLevel.ERROR) {
      const errorData =
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error;

      console.error(this.formatMessage('ERROR', message), errorData);

      if (IS_PRODUCTION && typeof window !== 'undefined') {
        this.sendToErrorTracking(message, errorData);
      }
    }
  }

  performance(name: string, duration: number, context?: LogContext): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      context: { ...this.context, ...context },
    };

    this.performanceMetrics.push(metric);

    if (CURRENT_LEVEL <= LogLevel.PERFORMANCE) {
      this.info(`Performance: ${name}`, { duration, ...context });
    }

    if (IS_PRODUCTION && typeof window !== 'undefined') {
      this.sendToAnalytics(metric);
    }
  }

  time(name: string, context?: LogContext): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.performance(name, duration, context);
    };
  }

  action(actionName: string, data?: any): void {
    this.info(`User Action: ${actionName}`, data);

    if (IS_PRODUCTION && typeof window !== 'undefined') {
      this.sendToAnalytics({
        type: 'user_action',
        action: actionName,
        data,
        timestamp: Date.now(),
      });
    }
  }

  navigation(from: string, to: string): void {
    this.info(`Navigation: ${from} → ${to}`);
  }

  api(method: string, endpoint: string, status?: number, duration?: number): void {
    const message = `API ${method} ${endpoint}${status ? ` - ${status}` : ''}`;

    if (status && status >= 400) {
      this.warn(message, { duration });
    } else {
      this.info(message, { duration });
    }
  }

  componentMount(componentName: string): void {
    this.debug(`Component mounted: ${componentName}`);
  }

  componentUnmount(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`);
  }

  componentUpdate(componentName: string, props?: any): void {
    this.debug(`Component updated: ${componentName}`, props);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  clearMetrics(): void {
    this.performanceMetrics = [];
  }

  private sendToErrorTracking(message: string, error: any): void {}

  private sendToAnalytics(data: any): void {}
}

export const logger = new Logger();

export const componentLogger = (componentName: string) => logger.child({ component: componentName });
export const apiLogger = logger.child({ component: 'api' });
export const navigationLogger = logger.child({ component: 'navigation' });

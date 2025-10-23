enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  requestId?: string;
  operation?: string;
  date?: string;
  duration?: number;
  [key: string]: string | number | boolean | null | undefined;
}

const LOG_LEVEL = (process.env.LOG_LEVEL as keyof typeof LogLevel) || 'INFO';
const CURRENT_LEVEL = LogLevel[LOG_LEVEL] || LogLevel.INFO;

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function formatMessage(level: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = formatContext(context);
  return `[${timestamp}] [${level}]${contextStr} ${message}`;
}

function formatContext(context?: LogContext): string {
  if (!context) return '';

  const parts: string[] = [];
  if (context.requestId) parts.push(`req=${context.requestId}`);
  if (context.operation) parts.push(`op=${context.operation}`);
  if (context.date) parts.push(`date=${context.date}`);
  if (context.duration) parts.push(`${context.duration}ms`);

  return parts.length > 0 ? ` [${parts.join(' ')}]` : '';
}

export class Logger {
  public context: LogContext = {};

  constructor(initialContext: LogContext = {}) {
    this.context = { ...initialContext };
  }

  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  debug(message: string, data?: unknown): void {
    if (CURRENT_LEVEL <= LogLevel.DEBUG) {
      const extra = data ? ` ${JSON.stringify(data)}` : '';
      console.debug(formatMessage('DEBUG', message + extra, this.context));
    }
  }

  info(message: string, data?: unknown): void {
    if (CURRENT_LEVEL <= LogLevel.INFO) {
      const extra = data ? ` ${JSON.stringify(data)}` : '';
      console.info(formatMessage('INFO', message + extra, this.context));
    }
  }

  warn(message: string, data?: unknown): void {
    if (CURRENT_LEVEL <= LogLevel.WARN) {
      const extra = data ? ` ${JSON.stringify(data)}` : '';
      console.warn(formatMessage('WARN', message + extra, this.context));
    }
  }

  error(message: string, error?: unknown): void {
    if (CURRENT_LEVEL <= LogLevel.ERROR) {
      const errorStr =
        error instanceof Error
          ? `\n${error.name}: ${error.message}\n${error.stack}`
          : error
            ? ` ${JSON.stringify(error)}`
            : '';
      console.error(formatMessage('ERROR', message + errorStr, this.context));
    }
  }

  request(method: string, path: string): Logger {
    const requestId = generateRequestId();
    const requestLogger = this.child({ requestId, operation: 'request' });
    requestLogger.info(`${method} ${path}`);
    return requestLogger;
  }

  response(status: number, duration: number): void {
    if (status >= 400) {
      this.warn(`Response ${status}`, { duration });
    } else {
      this.info(`Response ${status}`, { duration });
    }
  }

  operation(name: string, date?: string): Logger {
    return this.child({ operation: name, date });
  }

  time(): (message?: string) => void {
    const start = Date.now();
    return (message = 'Operation completed') => {
      const duration = Date.now() - start;
      this.info(message, { duration });
    };
  }
}

export const logger = new Logger();

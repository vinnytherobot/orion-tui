export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

export class Logger {
  private level: LogLevel;
  private prefix: string;
  private timestamp: boolean;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.prefix = options.prefix ?? '';
    this.timestamp = options.timestamp ?? true;
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  child(prefix: string): Logger {
    const childPrefix = this.prefix ? `${this.prefix}:${prefix}` : prefix;
    return new Logger({
      level: this.level,
      prefix: childPrefix,
      timestamp: this.timestamp,
    });
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level < this.level) return;

    const parts: string[] = [];
    if (this.timestamp) parts.push(new Date().toISOString());
    parts.push(`[${LogLevel[level]}]`);
    if (this.prefix) parts.push(`[${this.prefix}]`);
    parts.push(message);

    const formatted = parts.join(' ');

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted, ...args);
        break;
      case LogLevel.INFO:
        console.info(formatted, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formatted, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formatted, ...args);
        break;
    }
  }
}

export const logger = new Logger();

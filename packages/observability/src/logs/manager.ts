import pino from 'pino';
import { SignalManager } from '../core/signal-manager';
import type { LogsConfig } from '../core/types';

export class LogsManager extends SignalManager<LogsConfig> {
  private loggingProvider: pino.Logger;

  init() {
    this.loggingProvider = pino({
      level: this.config.level,
      // Default attributes that are added as a child logger to each log line
      base: this.config.defaultAttributes,
    });
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  get logger() {
    return this.loggingProvider;
  }
}

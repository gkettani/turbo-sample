import type { MetricReader } from '@opentelemetry/sdk-metrics';

/**
 * Main configuration for the observability client
 */
export interface ObservabilityConfig {
  /** Name of the service generating the signals */
  serviceName: string;
  /** Environment (e.g., 'production', 'staging') */
  environment: string;
  /** Service version or commit hash */
  version?: string;
  /** Global attributes to be used with all signals */
  globalAttributes?: Record<string, string>;
  metrics?: MetricsConfig;
  logs?: LogsConfig;
}

export interface MetricsExporter {
  create(): MetricReader;
}

export interface SignalConfig {
  enabled: boolean;
  defaultAttributes?: Record<string, string>;
}

export interface MetricsConfig extends SignalConfig {
  exporters: MetricsExporter[];
}

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogsConfig extends SignalConfig {
  level: LogLevel;
}

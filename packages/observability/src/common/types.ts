/**
 * Utility types
 */
type ObjectValues<T> = T[keyof T];

/**
 * Supported observability signal types
 */
export const SIGNAL_TYPE = {
  METRICS: 'metrics',
  LOGS: 'logs',
  TRACES: 'traces',
} as const;

export type SignalType = ObjectValues<typeof SIGNAL_TYPE>;

/**
 * Supported severity levels for logging
 */
export const SEVERITY_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type SeverityLevel = ObjectValues<typeof SEVERITY_LEVEL>;

/**
 * Base configuration for all transport types
 */
export interface BaseTransportConfig {
  type: string;
  /** Whether this transport is active */
  enabled?: boolean;
  /** Number of signals to collect before sending to the backend */
  batchSize?: number;
  /** How often to flush the buffer in milliseconds */
  flushIntervalMs?: number;
  /** Maximum number of retry attempts for failed transmissions */
  maxRetries?: number;
  /** Maximum number of signals that can be stored in memory */
  bufferSize?: number;
}

/**
 * Supported transport types and their configurations
 */
export interface DatadogTransportConfig extends BaseTransportConfig {
  type: 'datadog';
  apiKey: string;
  /** Region-specific Datadog site (e.g., 'datadoghq.eu' for EU) */
  datadogSite?: string;
}

export interface PrometheusTransportConfig extends BaseTransportConfig {
  type: 'prometheus';
  port?: number;
  /** Custom endpoint path (defaults to /metrics) */
  endpoint?: string;
}

export interface BetterStackTransportConfig extends BaseTransportConfig {
  type: 'betterstack';
  /** BetterStack source token for authentication */
  sourceToken: string;
}

export type TransportConfig =
  | DatadogTransportConfig
  | PrometheusTransportConfig
  | BetterStackTransportConfig;

/**
 * Sampling configuration for different signals
 * Values should be between 0 and 1, where:
 * - 0 means no sampling (nothing is collected)
 * - 1 means full sampling (everything is collected)
 * - 0.5 means 50% sampling
 */
export interface SamplingConfig {
  metrics?: number;
  logging?: number;
  tracing?: number;
}

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
  /** List of configured transports */
  transports: TransportConfig[];
  /** Sampling configuration for each signal type */
  sampling?: SamplingConfig;
  /** Labels to be attached to all signals */
  defaultLabels?: Record<string, string>;
  /** Global buffer size for all signals */
  bufferSize?: number;
  /** Global flush interval in milliseconds */
  flushIntervalMs?: number;
}

/**
 * Interface for all signal managers (metrics, logging, tracing)
 */
export interface SignalManager {
  init(): Promise<void>;
  shutdown(): Promise<void>;
  isEnabled(): boolean;
}

/**
 * Base interface for all transport implementations
 */
export interface Transport {
  init(): Promise<void>;
  shutdown(): Promise<void>;
  send(data: unknown): Promise<void>;
  flush(): Promise<void>;
}

/**
 * Context information that can be attached to signals for correlation
 */
export interface Context {
  /** Unique identifier for a distributed trace */
  traceId?: string;
  /** Unique identifier for the current operation */
  spanId?: string;
  /** Identifier of the parent operation in a trace */
  parentSpanId?: string;
  /** Key-value pairs that propagate across service boundaries */
  baggage?: Record<string, string>;
  /** Additional context values */
  [key: string]: unknown;
}

/**
 * Common attributes that can be attached to any signal
 */
export interface CommonAttributes {
  /** Name of the service generating the signal */
  service: string;
  /** Environment where the service is running */
  environment: string;
  /** Service version or commit hash */
  version?: string;
  /** Additional attributes */
  [key: string]: unknown;
}

/**
 * Configuration for handling errors in signal transmission
 */
export interface ErrorHandlingOptions {
  /** Whether to retry failed transmissions */
  retry?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Base delay between retries in milliseconds (will be used with exponential backoff) */
  backoffMs?: number;
  /** Function to call if all retries fail */
  fallback?: () => Promise<void>;
}

/**
 * Health status information for monitoring the observability system
 */
export interface HealthStatus {
  /** Current health state of the component */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Additional information about the health state */
  details?: Record<string, unknown>;
  /** Timestamp of the last health check */
  lastCheck: Date;
  /** Optional message explaining the current status */
  message?: string;
}

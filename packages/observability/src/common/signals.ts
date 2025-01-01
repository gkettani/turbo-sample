import type { Context, CommonAttributes, SeverityLevel } from './types';

/**
 * Configuration options for metric instruments
 */
export interface MetricOptions {
  /** Human-readable description of what this metric represents */
  description?: string;
  /** Unit of measurement (e.g., 'seconds', 'bytes', 'requests') */
  unit?: string;
  /** Static labels to be attached to all measurements */
  labels?: Record<string, string>;
}

/**
 * Interface for cumulative metrics that only increase
 */
export interface Counter {
  /** Increment the counter by a given value (defaults to 1) */
  increment(value?: number, labels?: Record<string, string>): void;
  /** Get the current value of the counter */
  getCurrentValue(): number;
}

/**
 * Interface for metrics that can increase and decrease
 */
export interface Gauge {
  /** Set the gauge to a specific value */
  set(value: number, labels?: Record<string, string>): void;
  /** Get the current value of the gauge */
  getCurrentValue(): number;
}

/**
 * Interface for metrics that track value distributions
 */
export interface Histogram {
  /** Record a value in the histogram */
  record(value: number, labels?: Record<string, string>): void;
  /** Get the current bucket boundaries */
  getBuckets(): number[];
}

export interface MetricsManager {
  counter(name: string, options?: MetricOptions): Counter;
  gauge(name: string, options?: MetricOptions): Gauge;
  histogram(name: string, buckets?: number[], options?: MetricOptions): Histogram;
}

/**
 * Structure of a log entry in the system
 */
export interface LogEntry {
  /** Log message content */
  message: string;
  /** Severity level of the log */
  severity: SeverityLevel;
  /** When the log was generated */
  timestamp: Date;
  /** Correlation context for distributed tracing */
  context?: Context;
  /** Common attributes to be attached to the log */
  attributes?: CommonAttributes;
  /** Additional custom fields */
  [key: string]: unknown;
}

/**
 * Configuration options for log entries
 */
export interface LogOptions {
  /** Correlation context for distributed tracing */
  context?: Context;
  /** Additional attributes to attach to the log */
  attributes?: Record<string, string>;
}

export interface LoggingManager {
  log(entry: LogEntry): void;
  debug(message: string, options?: LogOptions): void;
  info(message: string, options?: LogOptions): void;
  warn(message: string, options?: LogOptions): void;
  error(message: string, error?: Error, options?: LogOptions): void;
  fatal(message: string, error?: Error, options?: LogOptions): void;
}

/**
 * Configuration options for trace spans
 */
export interface SpanOptions {
  /** Custom attributes to attach to the span */
  attributes?: Record<string, string>;
  /** Custom start time (defaults to now) */
  startTime?: Date;
  /** Correlation context for the span */
  context?: Context;
}

/**
 * Interface representing a single operation in a distributed trace
 */
export interface Span {
  /** Unique identifier for this span */
  id: string;
  /** ID of the trace this span belongs to */
  traceId: string;
  /** ID of the parent span, if any */
  parentSpanId?: string;
  /** Name of the operation this span represents */
  name: string;
  /** When the span started */
  startTime: Date;
  /** When the span ended (if it has) */
  endTime?: Date;
  /** Custom attributes attached to the span */
  attributes: Record<string, string>;
  /** List of events that occurred during the span */
  events: SpanEvent[];
  /** Current status of the operation */
  status: SpanStatus;
  /** Mark the span as completed */
  end(endTime?: Date): void;
  /** Record a timestamped event within the span */
  addEvent(name: string, attributes?: Record<string, string>): void;
  /** Update the span's status */
  setStatus(status: SpanStatus): void;
  /** Add or update a span attribute */
  setAttribute(key: string, value: string): void;
}

/**
 * Structure for events that occur during a span
 */
export interface SpanEvent {
  /** Name of the event */
  name: string;
  /** When the event occurred */
  timestamp: Date;
  /** Custom attributes for the event */
  attributes?: Record<string, string>;
}

/**
 * Status of a span, indicating whether the operation succeeded
 */
export interface SpanStatus {
  /** Status code of the operation */
  code: 'ok' | 'error' | 'unset';
  /** Optional message explaining the status */
  message?: string;
}

export interface TracingManager {
  /** Start a new span */
  startSpan(name: string, options?: SpanOptions): Span;
  /** Get the currently active span */
  getCurrentSpan(): Span | undefined;
  /** Execute a function within the context of a new span */
  withSpan<T>(name: string, fn: (span: Span) => Promise<T>, options?: SpanOptions): Promise<T>;
}
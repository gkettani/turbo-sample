import {
  OpenTelemetryConsoleExporter,
  OpenTelemetryOTLPExporter,
  OpenTelemetryPrometheusExporter,
} from '../metrics/exporters';
import { ObservabilityClient } from './client';
import type {
  LogLevel,
  LogsConfig,
  MetricsConfig,
  MetricsExporter,
  ObservabilityConfig,
} from './types';

export class ObservabilityClientBuilder {
  private config: Partial<ObservabilityConfig> = {};

  setServiceName(name: string): this {
    this.config.serviceName = name;
    return this;
  }

  setVersion(version: string): this {
    this.config.version = version;
    return this;
  }

  setEnvironment(env: string): this {
    this.config.environment = env;
    return this;
  }

  withGlobalAttributes(attributes: Record<string, string>): this {
    if (!this.config.globalAttributes) {
      this.config.globalAttributes = {};
    }
    this.config.globalAttributes = { ...attributes };
    return this;
  }

  withMetrics(
    configurator: (config: MetricsConfigBuilder) => MetricsConfigBuilder
  ): this {
    const builder = new MetricsConfigBuilder();
    this.config.metrics = configurator(builder).build();
    return this;
  }

  withLogger(
    configurator: (config: LoggerConfigBuilder) => LoggerConfigBuilder
  ): this {
    const builder = new LoggerConfigBuilder();
    this.config.logs = configurator(builder).build();
    return this;
  }

  build(): ObservabilityClient {
    return new ObservabilityClient(this.config as ObservabilityConfig);
  }
}

class MetricsConfigBuilder {
  private readonly exporters: MetricsExporter[] = [];
  private enabled = true;

  /**
   * Enables or disables metrics collection
   */
  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    return this;
  }

  /**
   * Adds a console exporter for OpenTelemetry metrics
   */
  addOpenTelemetryConsoleExporter(): this {
    if (!this.hasExporterOfType(OpenTelemetryConsoleExporter)) {
      this.exporters.push(new OpenTelemetryConsoleExporter());
    }
    return this;
  }
  /**
   * Adds a Prometheus exporter for OpenTelemetry metrics
   */
  addOpenTelemetryPrometheusExporter(): this {
    if (!this.hasExporterOfType(OpenTelemetryPrometheusExporter)) {
      this.exporters.push(new OpenTelemetryPrometheusExporter());
    }
    return this;
  }
  /**
   * Adds a OTLP exporter for OpenTelemetry metrics
   */
  addOpenTelemetryOTLPExporter(): this {
    if (!this.hasExporterOfType(OpenTelemetryOTLPExporter)) {
      this.exporters.push(new OpenTelemetryOTLPExporter());
    }
    return this;
  }

  /**
   * Checks if an exporter of a specific type already exists
   */
  private hasExporterOfType(
    type: new (...args: unknown[]) => MetricsExporter
  ): boolean {
    return this.exporters.some((exporter) => exporter instanceof type);
  }

  /**
   * Builds and returns the final metrics configuration
   * @throws Error if no exporters are configured
   */
  build(): MetricsConfig {
    if (this.exporters.length === 0) {
      throw new Error('At least one exporter must be configured');
    }
    return Object.freeze({
      enabled: this.enabled,
      exporters: [...this.exporters],
    });
  }
}

class LoggerConfigBuilder {
  private level: LogLevel;
  private enabled = true;

  /**
   * Set log level
   */
  setLevel(level: LogLevel): this {
    this.level = level;
    return this;
  }

  build(): LogsConfig {
    return Object.freeze({
      enabled: this.enabled,
      level: this.level,
    });
  }
}

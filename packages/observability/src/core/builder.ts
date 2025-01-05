import {
  OpenTelemetryConsoleExporter,
  OpenTelemetryPrometheusExporter,
} from '../metrics/exporters';
import { ObservabilityClient } from './client';
import type { MetricsConfig, ObservabilityConfig } from './types';

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
    this.config.globalAttributes = attributes;
    return this;
  }

  withMetrics(
    configurator: (config: MetricsConfigBuilder) => MetricsConfigBuilder
  ): this {
    const builder = new MetricsConfigBuilder();
    this.config.metrics = configurator(builder).build();
    return this;
  }

  build(): ObservabilityClient {
    return new ObservabilityClient(this.config as ObservabilityConfig);
  }
}

class MetricsConfigBuilder {
  private config: Partial<MetricsConfig>;

  addOpenTelemetryConsoleExporter(): this {
    this.config.exporters?.push(new OpenTelemetryConsoleExporter());
    return this;
  }

  addOpenTelemetryPrometheusExporter(): this {
    this.config.exporters?.push(new OpenTelemetryPrometheusExporter());
    return this;
  }

  build(): MetricsConfig {
    this.config.enabled = true;
    return this.config as MetricsConfig;
  }
}

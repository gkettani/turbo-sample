import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { LogsManager } from '../logs/manager';
import { MetricsManager } from '../metrics/manager';
import type { ObservabilityConfig } from './types';

export class ObservabilityClient {
  private readonly metricsManager: MetricsManager;
  private readonly logsManager: LogsManager;
  private readonly config: ObservabilityConfig;
  private readonly resource: Resource;

  constructor(config: ObservabilityConfig) {
    this.validateConfig(config);
    this.config = config;
    this.resource = this.createResource();

    if (this.config.metrics?.enabled) {
      this.metricsManager = new MetricsManager(
        this.config.metrics,
        this.resource
      );
      this.metricsManager.init();
    }

    if (this.config.logs?.enabled) {
      this.logsManager = new LogsManager(
        this.config.logs,
        this.resource
      )
      this.logsManager.init();
    }
  }

  private validateConfig(config: ObservabilityConfig): void {
    if (!config.serviceName) {
      throw new Error('serviceName is required');
    }
  }

  private createResource(): Resource {
    const resource = Resource.default().merge(
      new Resource({
        [ATTR_SERVICE_NAME]: this.config.serviceName,
        [ATTR_SERVICE_VERSION]: this.config.version,
        ...this.config.globalAttributes,
      })
    );

    return resource;
  }

  get metrics() {
    if (!this.metricsManager) {
      throw new Error('Metrics are not enabled');
    }
    // TODO: Define what to pass to the getMeter method
    return this.metricsManager.metrics.getMeter(
      this.config.serviceName, // 'instrumentation-scope-name'
      this.config.version // 'instrumentation-scope-version'
    );
  }

  get logger() {
    return this.logsManager.logger;
  }
}

import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { SignalManager } from '../core/signal-manager';
import type { MetricsConfig } from '../core/types';

export class MetricsManager extends SignalManager<MetricsConfig> {
  private meterProvider: MeterProvider;

  init() {
    if (!this.config.exporters || this.config.exporters.length === 0) {
      throw new Error('No exporter defined');
    }
    this.meterProvider = new MeterProvider({
      resource: this.resource,
      readers: this.config.exporters.map((exporter) => exporter.create()),
    });
  }

  shutdown(): Promise<void> {
    return this.meterProvider.shutdown();
  }

  isEnabled(): boolean {
    return (
      this.config.enabled &&
      !!this.config.exporters &&
      this.config.exporters?.length > 0
    );
  }

  get metrics() {
    return this.meterProvider;
  }
}

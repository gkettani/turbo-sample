import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import type { MetricsExporter } from '../core/types';

export class OpenTelemetryConsoleExporter implements MetricsExporter {
  create() {
    return new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    });
  }
}

export class OpenTelemetryPrometheusExporter implements MetricsExporter {
  create() {
    return new PrometheusExporter({
      port: 9464,
    });
  }
}

export class OpenTelemetryOTLPExporter implements MetricsExporter {
  create() {
    return new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: 'http://localhost:4318/v1/metrics',
        headers: {},
      }),
    });
  }
}

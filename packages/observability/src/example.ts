import { ObservabilityClientBuilder } from './core/builder';

const observability = new ObservabilityClientBuilder()
  .setServiceName('payment-service')
  .setEnvironment('production')
  .setVersion('commit-hash-892867HJE2')
  .withGlobalAttributes({
    region: 'us-east-1',
    cloudProvider: 'aws',
    dataCenter: 'aws-1',
    team: 'payments',
    host: 'host-name',
  })
  .withLogger((config) => config.setLevel('info'))
  .withMetrics((config) =>
    config
      .addOpenTelemetryConsoleExporter()
      .addOpenTelemetryPrometheusExporter()
  )
  .build();

export const { logger, metrics } = observability;

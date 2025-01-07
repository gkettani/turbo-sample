# Observability Service Documentation

## Basic Setup

Initialize the service with minimum configuration:

```typescript
import {
  ObservabilityClient,
  type ObservabilityConfig,
} from "@acme/observability";

const config: ObservabilityConfig = {
  serviceName: "payment-service",
  environment: "production",
  version: "commit-hash-892HE29U2",
  globalAttributes: {
    region: "us-east-1",
    cloudProvider: "aws",
    dataCenter: "aws-1",
    team: "payments",
    host: "host-name",
  },
  metrics: {
    enabled: true,
    exporters: [],
    defaultAttributes: {},
  },
};

const observability = new ObservabilityClient(config);

export const { metrics } = observability;
```

Initialize the service using the builder pattern:

```typescript
import { ObservabilityClientBuilder } from "@acme/observability";

const observability = new ObservabilityClientBuilder()
  .setServiceName("payment-service")
  .setEnvironment("production")
  .setVersion("commit-hash-892867HJE2")
  .withGlobalAttributes({
    region: "us-east-1",
    cloudProvider: "aws",
    dataCenter: "aws-1",
    team: "payments",
    host: "host-name",
  })
  .withLogger((config) => config.setLevel("info"))
  .withMetrics((config) =>
    config
      .addOpenTelemetryConsoleExporter()
      .addOpenTelemetryPrometheusExporter()
  )
  .build();

export const { logger, metrics } = observability;
```

## Metrics Examples

```typescript
import { metrics } from "./my-service/observability";

// Counter
const requestCounter = metrics.createCounter("http_requests_total", {
  description: "Total HTTP requests",
});
requestCounter.add(1, { method: "GET", path: "/users" });

// Histogram
const latencyHistogram = metrics.createHistogram("request_duration_seconds", {
  description: "Request duration in seconds",
});
latencyHistogram.record(0.157, { endpoint: "/api/users" });

// UpDownCounter
const activeConnections = metrics.createUpDownCounter("active_connections", {
  description: "Current number of active connections",
});
activeConnections.add(1); // Connection opened
activeConnections.add(-1); // Connection closed
```

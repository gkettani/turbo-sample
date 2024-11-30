interface ProxyLogEntry {
  // Identification
  requestId: string; // Unique identifier for each request
  timestamp: string; // ISO timestamp of request

  // Request Details
  method: string; // HTTP method (GET, POST, etc.)
  originalUrl: string; // Full original request URL
  targetUrl: string; // Proxied target URL

  // Origin Information
  clientIp: string; // IP address of the requester
  userAgent: string; // User agent string
  origin: string; // Origin domain

  // Performance Metrics
  requestStartTime: number;
  requestEndTime: number;
  processingDurationMs: number;

  // Size Metrics
  requestBodySize: number;
  responseBodySize: number;

  // Response Details
  statusCode: number;
  responseContentType: string;

  // Error Tracking
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };

  // Security & Routing
  isAllowedOrigin: boolean;
  routedThroughProxy: boolean;

  // Additional Context
  headers: {
    request: Record<string, string>;
    response: Record<string, string>;
  };
}

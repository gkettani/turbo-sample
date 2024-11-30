import type { ExportedHandler } from '@cloudflare/workers-types';

const logger = console;

export default {
  fetch(request, env, _ctx): Promise<Response> {
    // Handle preflight CORS requests
    if (request.method === 'OPTIONS') {
      return Promise.resolve(
        new Response(null, {
          headers: addCorsHeaders(new Headers()),
        })
      );
    }
    return handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const { pathname, search } = new URL(request.url);
  const targetUrl = `${env.API_URL}${pathname}${search}`;
  const requestStartTime = Date.now();

  const logEntry: Partial<ProxyLogEntry> = {
    requestId: crypto.randomUUID(),
    requestStartTime,
    timestamp: new Date().toISOString(),
    method: request.method,
    originalUrl: request.url,
    clientIp: request.headers.get('cf-connecting-ip') || 'unknown',
    origin: request.headers.get('origin') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    targetUrl,
    requestBodySize: request.body ? (await request.clone().text()).length : 0,
  };

  try {
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    const response = await fetch(proxyRequest);

    logEntry.requestEndTime = Date.now();
    logEntry.processingDurationMs = logEntry.requestEndTime - requestStartTime;
    logEntry.statusCode = response.status;
    logEntry.responseContentType =
      response.headers.get('content-type') || 'unknown';

    // Clone response to get body size
    const responseClone = response.clone();
    const responseBody = await responseClone.text();
    logEntry.responseBodySize = responseBody.length;

    // Capture headers
    logEntry.headers = {
      request: Object.fromEntries(request.headers),
      response: Object.fromEntries(response.headers),
    };

    logger.log(JSON.stringify(logEntry));

    // Create a new response with CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: addCorsHeaders(response.headers),
    });
  } catch (error) {
    logEntry.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    logEntry.statusCode = 500;
    logger.error(JSON.stringify(logEntry));
    return new Response('Internal Server Error', {
      status: 500,
      headers: addCorsHeaders(new Headers()),
    });
  }
}

function addCorsHeaders(headers: Headers): Headers {
  const corsHeaders = new Headers(headers);
  corsHeaders.set('Access-Control-Allow-Origin', '*');
  corsHeaders.set(
    'Access-Control-Allow-Methods',
    'GET,HEAD,POST,OPTIONS,PUT,DELETE'
  );
  corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
  return corsHeaders;
}

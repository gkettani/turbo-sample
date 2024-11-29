import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '@repo/api';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import env from './env';

const app = new Hono();

app.use(logger());

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  })
);

/**
 * Ping Pong
 */
app.use('/ping', logger());
app.get('/ping', (c) => c.json({ ping: 'pong', env: env.NODE_ENV }, 200));

export default app;

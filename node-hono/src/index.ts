import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { indexRoute } from './routes/indexRoute';
import { config } from './config';

const app = new Hono();
app.use('*', logger());

indexRoute(app);

serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  (info) => {
    console.log(`🚀 Up on http://${info.address}:${info.port}`);
  }
);

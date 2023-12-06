import client, { register } from 'prom-client';

if (process.env.NODE_ENV === 'production') {
  client.collectDefaultMetrics({ register });
}

export { client, register };

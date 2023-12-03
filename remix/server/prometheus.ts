import express from 'express';
import client, { register } from 'prom-client';
import { startServer } from './utils/startServer';

client.collectDefaultMetrics({ register });

const metricsServer = express();

metricsServer.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

startServer({
  name: 'metrics',
  server: metricsServer,
  port: 8081,
});

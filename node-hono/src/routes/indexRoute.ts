import { Hono } from 'hono';

export function indexRoute(app: Hono) {
  app.get('/', async ({ req, text }) => {
    return text('hello');
  });
}

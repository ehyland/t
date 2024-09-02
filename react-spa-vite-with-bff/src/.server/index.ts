import express from 'express';
import helmet from 'helmet';
import { env } from './env';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const middleware = await (process.env.NODE_ENV === 'production'
  ? import('./middleware.prod')
  : import('./middleware.dev'));

middleware.applyTrpcMiddleware(app);
middleware.applyAssetMiddleware(app);

const HOSTNAME = '0.0.0.0';

app.listen(env.PORT, HOSTNAME, () => {
  console.log(`Listening on http://localhost:${env.PORT}`);
});

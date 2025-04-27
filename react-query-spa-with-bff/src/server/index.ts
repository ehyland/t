import closeWithGrace from 'close-with-grace';

import { createApp } from './app';
import { log } from './logger';

const HOSTNAME = '0.0.0.0';
const PORT = Number(process.env.PORT ?? 4000);

const app = await createApp();

const server = app.listen(PORT, HOSTNAME, () => {
  log(`Listening on http://localhost:${PORT}`);
});

closeWithGrace(
  () =>
    new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    }),
);

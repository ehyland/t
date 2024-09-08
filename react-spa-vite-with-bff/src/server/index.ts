import closeWithGrace from 'close-with-grace';
import { createApp } from './app';

const HOSTNAME = '0.0.0.0';
const PORT = Number(process.env.PORT ?? 4000);

const app = await createApp();

const server = app.listen(PORT, HOSTNAME, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

closeWithGrace(
  () =>
    new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    }),
);

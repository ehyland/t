// first register source maps
import 'source-map-support/register.js';

// then remix globals
import '@remix-run/node/install.js';

// remaining imports
import { createRequestHandler } from '@remix-run/express';
import closeWithGrace from 'close-with-grace';
import express from 'express';
import http from 'http';

const config = {
  buildPath: './build/index.js',
  interfaces: [3000, 8080, 'run.sock'],
};

const app = express();

// handle asset requests
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
);
app.use(express.static('public', { maxAge: '1h' }));

// handle SSR requests
app.all(
  '*',
  createRequestHandler({
    build: await import(config.buildPath),
  })
);

/**
 *
 * @param {string | import('net').AddressInfo | null} address
 */
const addressToString = (address) => {
  if (address === null) return '_server not running_';
  if (typeof address === 'string') return address;
  return `http://localhost:${address?.port}`;
};

// Start servers
const servers = config.interfaces.map((portOrSocket) => {
  const server = http.createServer(app);
  server.listen(portOrSocket, () => {
    console.log(`🚀  listening on ${addressToString(server.address())}`);
  });
  return server;
});

closeWithGrace({ delay: 1_000 }, async function ({ err: processError }) {
  console.log();
  if (processError) {
    console.error(processError);
  }

  console.log(`...`);

  await Promise.all(
    servers.map(
      (server) =>
        new Promise((resolve, reject) => {
          const address = server.address();
          server.close((error) => {
            console.log(`🛬  Closed server ${addressToString(address)}`);
            error ? reject(error) : resolve(undefined);
          });
        })
    )
  );
});

import * as indexRoute from '~/routes/index-route';
import { config } from '~/config';
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

indexRoute.register(app);

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server is now running on http://localhost:${config.PORT}`);
});

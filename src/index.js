import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import mysqlRouter from './routes/mysqlRouter';
import redisRouter from './routes/redisRouter';
import mongoRouter from './routes/mongoRouter';
import requestRouter from './routes/requestRouter';

import { host, database } from './conf/mongoConf';

dotenv.config();

mongoose.connect(
  `mongodb://${host}/${database}`,
  { useNewUrlParser: true }
);

const app = express();

app.use(bodyParser.json());

app.use('/api/mysql', mysqlRouter);
app.use('/api/redis', redisRouter);
app.use('/api/mongo', mongoRouter);
app.use('/api/request', requestRouter);

app.get('/*', (req, res) => {
  res.status(404).json({ errors: 'Service invalid.' });
});

const port = process.env.EXPRESS_PORT || 3000;
// eslint-disable-next-line
app.listen(port, () => console.info(`express server running on ${port}`));

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import mysqlRouter from './routes/mysqlRouter';

dotenv.config();

// mongoose.connect(`mongodb://${dburl}/${dbname}`);

const app = express();

app.use(bodyParser.json());

app.use('/api/mysql', mysqlRouter);

app.get('/*', (req, res) => {
  res.status(404).json({ errors: 'Service invalid.' });
});

const port = process.env.EXPRESS_PORT || 3000;
// eslint-disable-next-line
app.listen(port, () => console.info(`express server running on ${port}`));

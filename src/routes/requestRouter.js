import express from 'express';
import request from 'request-promise';

const router = express.Router();

router.get('/', async (req, res) => {
  const response = await request
    .get(`http://localhost:8080/api/request/fake`)
    .then(result => JSON.parse(result));
  res.json({ api: true, response });
});

router.get('/fake', (req, res) => {
  res.json({ name: 'fake' });
});

export default router;

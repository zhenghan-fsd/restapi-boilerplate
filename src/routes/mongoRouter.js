import express from 'express';
import Test from '../models/MongoTest';

const router = express.Router();

router.get('/create', async (req, res) => {
  const test = new Test({
    name: 'Test Name',
    email: 'test@test.com'
  });

  const createdTest = await test.save();

  res.json({ api: true, createdTest });
});

router.get('/:id', async (req, res) => {
  const test = await Test.findById(req.params.id);

  res.json({ api: true, test });
});

export default router;

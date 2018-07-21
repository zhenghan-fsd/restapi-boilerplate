import express from 'express';
import {
  redisGet,
  redisSet,
  redisExists,
  redisDel,
  redisBrpop,
  redisLpush
} from '../utils/redis';

const requestMap = {};
const REDIS_TEST_QUEUE = 'redis_test_queue';

const router = express.Router();

const brpopQueue = async () => {
  // eslint-disable-next-line
  while (true) {
    // eslint-disable-next-line
    const result = await redisBrpop(REDIS_TEST_QUEUE);
    console.log(result);

    const res = requestMap.request;
    delete requestMap.request;

    res.json({ api: true, result });
  }
};

brpopQueue();

router.get('/plain', async (req, res) => {
  const key = 'rediskey';
  let result = await redisExists(key);
  console.log(`redisExists ${key}? ${result}`);

  const value = `Your value for the key`;
  result = await redisSet(key, value);
  console.log(`redisSet key: ${key} -- value: ${value} -- result: ${result}`);

  result = await redisExists(key);
  console.log(`redisExists ${key}? ${result}`);

  result = await redisGet(key);
  console.log(`redisGet key: ${key}, value: ${result}`);

  result = await redisDel(key);
  console.log(`redisDel ${key}? ${result}`);

  result = await redisExists(key);
  console.log(`redisExists ${key}? ${result}`);

  res.json({
    api: true,
    message: 'test done. Open your console to see the result'
  });
});

router.get('/queue', async (req, res) => {
  requestMap.request = res;

  const result = await redisLpush(REDIS_TEST_QUEUE, {
    name: 'test',
    value: 123456
  });
  if (!result) {
    res.status(500).json({ errors: { global: 'server error' } });
  }
});

export default router;

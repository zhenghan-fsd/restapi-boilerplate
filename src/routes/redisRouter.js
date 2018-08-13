import express from 'express';
import {
  redisGet,
  redisSet,
  redisExists,
  redisDel,
  redisBrpop,
  redisLpush,
  redisHset,
  redisHgetall
} from '../utils/redis';

const requestMap = {};
const REDIS_TEST_QUEUE = 'redis_test_queue';

const router = express.Router();

const brpopQueue = async () => {
  // eslint-disable-next-line
  while (true) {
    // eslint-disable-next-line
    const result = await redisBrpop(REDIS_TEST_QUEUE);

    if (requestMap.request) {
      const res = requestMap.request;
      delete requestMap.request;

      res.json({ api: true, result });
    }
  }
};

brpopQueue();

router.get('/plain', async (req, res) => {
  const key = 'rediskey';
  let result = await redisExists(key);

  const value = `Your value for the key`;
  result = await redisSet(key, value);

  result = await redisExists(key);

  result = await redisGet(key);

  result = await redisDel(key);

  result = await redisExists(key);

  res.json({
    api: true,
    result,
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

  setTimeout(() => {
    if (requestMap.request) {
      const r = requestMap.request;
      delete requestMap.request;

      r.json({ api: false, errors: { global: 'backend timeout' } });
    }
  }, 60 * 1000);
});

router.get('/object', async (req, res) => {
  const object = {
    name: 'test',
    password: '123456'
  };
  const key = 'hsethash';

  let result = await redisHset(key, object);

  result = await redisHgetall(key);

  res.json(result);
});

export default router;

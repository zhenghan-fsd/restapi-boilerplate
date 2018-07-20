import redis from 'redis';
import bluebird from 'bluebird';
import { host, port } from '../conf/redisConf';

bluebird.promisifyAll(redis);

const client = redis.createClient(port, host);
const blockingClient = client.duplicate();

export const redisSet = (key, value) =>
  client.setAsync(key, JSON.stringify(value));
export const redisGet = key =>
  client.getAsync(key).then(value => JSON.parse(value));
export const redisExists = key => client.existsAsync(key);
export const redisDel = key => client.delAsync(key);
export const redisBrpop = key =>
  blockingClient.brpopAsync(key, 0).then(value => JSON.parse(value[1]));
export const redisLpush = (key, value) =>
  client.lpushAsync(key, JSON.stringify(value));

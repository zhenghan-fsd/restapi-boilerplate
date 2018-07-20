import mysql from 'promise-mysql';
import { host, user, password, database, poolSize } from '../conf/mysqlConf';

const db = mysql.createPool({
  connectionLimit: poolSize,
  host,
  user,
  password,
  database
});

export default db;

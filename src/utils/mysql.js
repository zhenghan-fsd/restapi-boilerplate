import mysql from 'promise-mysql';
import Promise from 'bluebird';
import mysqlConf from '../conf/mysqlConf';

export const db = mysql.createPool(mysqlConf);

export default db;

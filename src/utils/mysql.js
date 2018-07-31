import mysql from 'promise-mysql';
import Promise from 'bluebird';
import mysqlConf from '../conf/mysqlConf';

export const db = mysql.createPool(mysqlConf);

const connectionDisposer = () =>
  db.getConnection().disposer(connection => {
    connection.release();
  });

const withTransaction = fn =>
  Promise.using(connectionDisposer(), async connection => {
    await connection.beginTransaction();

    return Promise.try(fn, connection).then(
      res => connection.commit().thenReturn(res),
      err =>
        connection
          .rollback()
          .catch(() => {
            /* maybe add the rollback error to err */
          })
          .thenThrow(err)
    );
  });

export { db as default, withTransaction };

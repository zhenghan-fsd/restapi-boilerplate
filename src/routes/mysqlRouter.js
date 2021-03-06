import express from 'express';
import mysql, { withTransaction } from '../utils/mysql';

const router = express.Router();

router.get('/createtable', async (req, res) => {
  const sql = `create table test (name varchar(16), value varchar(16)) ENGINE=InnoDB DEFAULT CHARSET=utf8`;
  try {
    const results = await mysql.query(sql);
    res.json({ api: true, results });
  } catch (err) {
    res.json({ api: false });
  }
});

router.get('/insert', async (req, res) => {
  const sql = `insert into test (name, value) values ('test record', '000001')`;
  try {
    const results = await mysql.query(sql);
    res.json({ api: true, results });
  } catch (err) {
    res.json({ api: false });
  }
});

router.get('/list', async (req, res) => {
  const sql = `select * from test`;
  try {
    const results = await mysql.query(sql);
    res.json({ api: true, results });
  } catch (err) {
    res.json({ api: false });
  }
});

router.get('/transaction', async (req, res) => {
  const conn = await mysql.getConnection();
  try {
    let result = await conn.beginTransaction();

    let sql = `insert into test (name, value) values ('test record', '000001')`;
    await conn.query(sql);
    result = await conn.query('select count(1) from test');

    sql = `insert into test0 (name, value) values ('test record', '000002')`;
    await conn.query(sql);
    result = await conn.query('select * from test');

    conn.commit();
    res.json({ api: true, result });
  } catch (err) {
    conn.rollback();

    res.json({ api: false, err });
  } finally {
    conn.release();
  }
});

router.get('/transaction/v2', async (req, res) => {
  try {
    const transactionResult = await withTransaction(async tx => {
      let sqlResult = await tx.query(
        `insert into test (name, value) values ('test record', '000001')`
      );
      sqlResult = await tx.query('select count(1) from test');
      sqlResult = await tx.query(
        `insert into test0 (name, value) values ('test record', '000002')`
      );

      return sqlResult;
    });

    res.json(transactionResult);
  } catch (err) {
    res.json({ errors: { code: err.code, sqlMessage: err.sqlMessage } });
  }
});

export default router;

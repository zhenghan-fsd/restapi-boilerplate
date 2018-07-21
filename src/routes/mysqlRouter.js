import express from 'express';
import mysql from '../utils/mysql';

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

router.get('/rollback', async (req, res) => {
  try {
    const conn = await mysql.getConnection();
    console.log(`conn: ${conn}`);
    let result = await conn.query('SET autocommit = 0');
    console.log(`start transaction: ${result}`);
    let sql = `insert into test (name, value) values ('test record', '000001')`;
    result = await conn.query(sql);
    console.log(`insert 1: ${result}`);

    sql = `insert into test (name, value) values ('test record', '000002')`;
    result = await conn.query(sql);
    console.log(`insert 2: ${result}`);

    result = await conn.query('ROLLBACK');
    console.log(`rollback: ${result}`);

    result = await conn.query('SET autocommit = 1');
    console.log(`end transaction: ${result}`);

    result = await conn.query('select * from test');
    console.log(`query table: ${result}`);

    conn.release();

    res.json({ api: true, result });
  } catch (err) {
    res.json({ api: false });
  }
});

router.get('/commit', async (req, res) => {
  try {
    const conn = await mysql.getConnection();
    console.log(`conn: ${conn}`);
    let result = await conn.query('SET autocommit = 0');
    console.log(`start transaction: ${result}`);
    let sql = `insert into test (name, value) values ('test record', '000001')`;
    result = await conn.query(sql);
    console.log(`insert 1: ${result}`);

    sql = `insert into test (name, value) values ('test record', '000002')`;
    result = await conn.query(sql);
    console.log(`insert 2: ${result}`);

    result = await conn.query('COMMIT');
    console.log(`rollback: ${result}`);

    result = await conn.query('SET autocommit = 1');
    console.log(`end transaction: ${result}`);

    result = await conn.query('select * from test');
    console.log(`query table: ${result}`);

    conn.release();

    res.json({ api: true, result });
  } catch (err) {
    res.json({ api: false });
  }
});

export default router;
